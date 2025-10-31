"""Validate Alembic migrations by running upgrade/downgrade

This script runs alembic upgrade head and downgrade base against a
temporary SQLite database to verify migrations apply and revert cleanly.

Usage:
    python scripts/validate_migrations.py

It will set the env var DATABASE_URL just for the subprocess calls so your
project's alembic/env.py picks it up.
"""
import os
import subprocess
import tempfile
import sys

HERE = os.path.dirname(os.path.dirname(__file__))
ALEMBIC_INI = os.path.join(HERE, 'alembic.ini')


def run(cmd, env=None):
    print('> ' + ' '.join(cmd))
    p = subprocess.run(cmd, env=env, cwd=HERE, capture_output=True, text=True)
    print('stdout:\n', p.stdout)
    print('stderr:\n', p.stderr)
    if p.returncode != 0:
        raise SystemExit(f"Command failed: {cmd} (rc={p.returncode})")


def main():
    tmpfile = tempfile.NamedTemporaryFile(suffix='.db', delete=False)
    tmpfile.close()
    sqlite_url = f"sqlite:///{tmpfile.name}"

    env = os.environ.copy()
    env['DATABASE_URL'] = sqlite_url

    print('Using temporary sqlite DB:', sqlite_url)

    # Make sure alembic executable is used from the same Python env
    # Use -c to point to local alembic.ini
    run(['alembic', '-c', ALEMBIC_INI, 'upgrade', 'head'], env=env)
    run(['alembic', '-c', ALEMBIC_INI, 'downgrade', 'base'], env=env)

    print('Migrations validated successfully on temporary SQLite DB')


if __name__ == '__main__':
    main()
