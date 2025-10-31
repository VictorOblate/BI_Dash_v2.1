// dashboard-app/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default permissions
  console.log('Creating permissions...');
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.create({ data: { resource: 'user', action: 'view', description: 'View users' } }),
    prisma.permission.create({ data: { resource: 'user', action: 'create', description: 'Create users' } }),
    prisma.permission.create({ data: { resource: 'user', action: 'update', description: 'Update users' } }),
    prisma.permission.create({ data: { resource: 'user', action: 'delete', description: 'Delete users' } }),
    prisma.permission.create({ data: { resource: 'user', action: 'approve', description: 'Approve users' } }),

    // Dashboard permissions
    prisma.permission.create({ data: { resource: 'dashboard', action: 'view', description: 'View dashboards' } }),
    prisma.permission.create({ data: { resource: 'dashboard', action: 'create', description: 'Create dashboards' } }),
    prisma.permission.create({ data: { resource: 'dashboard', action: 'update', description: 'Update dashboards' } }),
    prisma.permission.create({ data: { resource: 'dashboard', action: 'delete', description: 'Delete dashboards' } }),

    // Data model permissions
    prisma.permission.create({ data: { resource: 'data_model', action: 'view', description: 'View data models' } }),
    prisma.permission.create({ data: { resource: 'data_model', action: 'create', description: 'Create data models' } }),
    prisma.permission.create({ data: { resource: 'data_model', action: 'update', description: 'Update data models' } }),
    prisma.permission.create({ data: { resource: 'data_model', action: 'delete', description: 'Delete data models' } }),

    // Upload permissions
    prisma.permission.create({ data: { resource: 'upload', action: 'view', description: 'View uploads' } }),
    prisma.permission.create({ data: { resource: 'upload', action: 'create', description: 'Create uploads' } }),
    prisma.permission.create({ data: { resource: 'upload', action: 'rollback', description: 'Rollback uploads' } }),

    // Role permissions
    prisma.permission.create({ data: { resource: 'role', action: 'view', description: 'View roles' } }),
    prisma.permission.create({ data: { resource: 'role', action: 'create', description: 'Create roles' } }),
    prisma.permission.create({ data: { resource: 'role', action: 'update', description: 'Update roles' } }),
    prisma.permission.create({ data: { resource: 'role', action: 'delete', description: 'Delete roles' } }),

    // Organization permissions
    prisma.permission.create({ data: { resource: 'organization', action: 'view', description: 'View organization' } }),
    prisma.permission.create({ data: { resource: 'organization', action: 'create', description: 'Create org units' } }),
    prisma.permission.create({ data: { resource: 'organization', action: 'update', description: 'Update org units' } }),
    prisma.permission.create({ data: { resource: 'organization', action: 'delete', description: 'Delete org units' } }),

    // Report permissions
    prisma.permission.create({ data: { resource: 'report', action: 'view', description: 'View reports' } }),
    prisma.permission.create({ data: { resource: 'report', action: 'create', description: 'Create reports' } }),
    prisma.permission.create({ data: { resource: 'report', action: 'export', description: 'Export reports' } }),
  ]);

  console.log(`✅ Created ${permissions.length} permissions`);

  // Create default roles
  console.log('Creating roles...');
  
  // Super Admin role - full access
  const superAdminRole = await prisma.role.create({
    data: {
      name: 'super_admin',
      description: 'Super administrator with full system access',
      isSystemRole: true,
    },
  });

  // Assign all permissions to super admin
  await Promise.all(
    permissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: superAdminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Admin role
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrator with management capabilities',
      isSystemRole: true,
    },
  });

  // Assign most permissions to admin (excluding some super admin only features)
  const adminPermissions = permissions.filter(p => !['role:delete', 'user:delete'].includes(`${p.resource}:${p.action}`));
  await Promise.all(
    adminPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  // Standard User role
  const userRole = await prisma.role.create({
    data: {
      name: 'user',
      description: 'Standard user with view access',
      isSystemRole: true,
    },
  });

  // Assign view permissions to standard user
  const userPermissions = permissions.filter(p => p.action === 'view');
  await Promise.all(
    userPermissions.map((permission) =>
      prisma.rolePermission.create({
        data: {
          roleId: userRole.id,
          permissionId: permission.id,
        },
      })
    )
  );

  console.log('✅ Created 3 roles (super_admin, admin, user)');

  // Create default super admin user
  console.log('Creating default super admin user...');
  const superAdminUser = await prisma.user.create({
    data: {
      email: 'admin@bidashboard.com',
      fullName: 'Super Administrator',
      passwordHash: await hash('admin123456', 12),
      status: 'active',
      emailVerified: true,
    },
  });

  // Assign super admin role
  await prisma.userRole.create({
    data: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id,
    },
  });

  console.log('✅ Created super admin user (admin@bidashboard.com / admin123456)');

  // Create sample organization structure
  console.log('Creating organization structure...');
  const company = await prisma.organizationalUnit.create({
    data: {
      name: 'BI Dashboard Company',
      type: 'company',
      description: 'Main company',
      path: '/1',
    },
  });

  const division = await prisma.organizationalUnit.create({
    data: {
      name: 'Technology Division',
      type: 'division',
      parentId: company.id,
      description: 'Technology and IT division',
      path: '/1/2',
    },
  });

  const department = await prisma.organizationalUnit.create({
    data: {
      name: 'Engineering Department',
      type: 'department',
      parentId: division.id,
      description: 'Software engineering department',
      path: '/1/2/3',
    },
  });

  const team = await prisma.organizationalUnit.create({
    data: {
      name: 'Data Analytics Team',
      type: 'team',
      parentId: department.id,
      description: 'Data analytics and BI team',
      path: '/1/2/3/4',
    },
  });

  console.log('✅ Created organization structure');

  // Assign super admin to company level
  await prisma.userOrganizationalUnit.create({
    data: {
      userId: superAdminUser.id,
      orgUnitId: company.id,
    },
  });

  // Create sample data model
  console.log('Creating sample data model...');
  const sampleDataModel = await prisma.dataModel.create({
    data: {
      name: 'sales_data',
      displayName: 'Sales Data',
      description: 'Sample sales transaction data',
      schemaJson: [
        {
          name: 'transaction_id',
          type: 'string',
          displayName: 'Transaction ID',
          required: true,
          unique: true,
        },
        {
          name: 'date',
          type: 'date',
          displayName: 'Transaction Date',
          required: true,
        },
        {
          name: 'product',
          type: 'string',
          displayName: 'Product Name',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          displayName: 'Quantity',
          required: true,
        },
        {
          name: 'amount',
          type: 'number',
          displayName: 'Amount',
          required: true,
        },
        {
          name: 'customer',
          type: 'string',
          displayName: 'Customer Name',
          required: false,
        },
      ],
      tableName: 'dm_sales_data',
      version: 1,
      createdBy: superAdminUser.id,
    },
  });

  console.log('✅ Created sample data model');

  // Create sample dashboard
  console.log('Creating sample dashboard...');
  const sampleDashboard = await prisma.dashboard.create({
    data: {
      name: 'Sales Overview Dashboard',
      description: 'Overview of sales metrics and performance',
      layout: {},
      createdBy: superAdminUser.id,
    },
  });

  // Create dashboard tab
  const dashboardTab = await prisma.dashboardTab.create({
    data: {
      dashboardId: sampleDashboard.id,
      name: 'Overview',
      order: 0,
      config: {},
    },
  });

  // Create sample visualizations
  await Promise.all([
    prisma.visualization.create({
      data: {
        tabId: dashboardTab.id,
        type: 'bar',
        title: 'Sales by Product',
        config: {
          xaxis: { title: 'Product' },
          yaxis: { title: 'Sales' },
        },
        query: 'SELECT product, SUM(amount) as sales FROM dm_sales_data GROUP BY product',
        order: 0,
      },
    }),
    prisma.visualization.create({
      data: {
        tabId: dashboardTab.id,
        type: 'line',
        title: 'Sales Trend',
        config: {
          xaxis: { title: 'Date' },
          yaxis: { title: 'Amount' },
        },
        query: 'SELECT date, SUM(amount) as total FROM dm_sales_data GROUP BY date ORDER BY date',
        order: 1,
      },
    }),
  ]);

  // Set dashboard permissions for all roles
  await Promise.all([
    prisma.dashboardPermission.create({
      data: {
        dashboardId: sampleDashboard.id,
        roleId: superAdminRole.id,
        permissionsJson: { view: true, edit: true, export: true },
      },
    }),
    prisma.dashboardPermission.create({
      data: {
        dashboardId: sampleDashboard.id,
        roleId: adminRole.id,
        permissionsJson: { view: true, edit: true, export: true },
      },
    }),
    prisma.dashboardPermission.create({
      data: {
        dashboardId: sampleDashboard.id,
        roleId: userRole.id,
        permissionsJson: { view: true, edit: false, export: true },
      },
    }),
  ]);

  console.log('✅ Created sample dashboard with visualizations');

  // Create audit log entry
  await prisma.auditLog.create({
    data: {
      userId: superAdminUser.id,
      action: 'seed',
      resource: 'database',
      details: JSON.stringify({ message: 'Database seeded successfully' }),
      status: 'success',
    },
  });

  console.log('✅ Created initial audit log');

  console.log('\n🎉 Database seed completed successfully!');
  console.log('\n📝 Default credentials:');
  console.log('   Email: admin@bidashboard.com');
  console.log('   Password: admin123456');
  console.log('\n⚠️  Please change the default password after first login!\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });