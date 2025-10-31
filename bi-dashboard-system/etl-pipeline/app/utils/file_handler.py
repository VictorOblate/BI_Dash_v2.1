"""
File Handling Utilities
etl-pipeline/app/utils/file_handler.py
"""
import pandas as pd
import os
from typing import Dict, Any, List, Tuple
from pathlib import Path
import logging

from ..config import settings

logger = logging.getLogger(__name__)


def validate_file(filename: str, file_size: int) -> Tuple[bool, str]:
    """
    Validate uploaded file
    
    Args:
        filename: Name of the file
        file_size: Size of the file in bytes
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    # Check file extension
    file_ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else ''
    
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        return False, f"Invalid file type. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
    
    # Check file size
    if file_size > settings.MAX_UPLOAD_SIZE:
        max_size_mb = settings.MAX_UPLOAD_SIZE / (1024 * 1024)
        return False, f"File size exceeds maximum allowed size of {max_size_mb}MB"
    
    return True, ""


def read_file_preview(file_path: str, rows: int = 10) -> Dict[str, Any]:
    """
    Read and preview file contents
    
    Args:
        file_path: Path to the file
        rows: Number of rows to preview
    
    Returns:
        Dictionary with preview data
    """
    try:
        file_ext = file_path.rsplit('.', 1)[-1].lower()
        
        # Read file based on extension
        if file_ext == 'csv':
            df = pd.read_csv(file_path, nrows=rows)
        elif file_ext in ['xlsx', 'xls']:
            df = pd.read_excel(file_path, nrows=rows)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
        
        # Detect data types
        detected_types = {}
        for col in df.columns:
            dtype = str(df[col].dtype)
            if 'int' in dtype:
                detected_types[col] = 'number'
            elif 'float' in dtype:
                detected_types[col] = 'number'
            elif 'datetime' in dtype:
                detected_types[col] = 'date'
            elif 'bool' in dtype:
                detected_types[col] = 'boolean'
            else:
                detected_types[col] = 'string'
        
        return {
            "columns": df.columns.tolist(),
            "sample_data": df.to_dict(orient='records'),
            "row_count": len(df),
            "detected_types": detected_types,
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Error reading file preview: {e}")
        return {
            "success": False,
            "error": str(e)
        }


def read_full_file(file_path: str) -> pd.DataFrame:
    """
    Read entire file into DataFrame
    
    Args:
        file_path: Path to the file
    
    Returns:
        pandas DataFrame
    """
    file_ext = file_path.rsplit('.', 1)[-1].lower()
    
    if file_ext == 'csv':
        return pd.read_csv(file_path)
    elif file_ext in ['xlsx', 'xls']:
        return pd.read_excel(file_path)
    else:
        raise ValueError(f"Unsupported file type: {file_ext}")


def process_upload(
    file_path: str,
    data_model_schema: List[Dict[str, Any]],
    column_mapping: Dict[str, str] = None
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Process uploaded file according to data model schema
    
    Args:
        file_path: Path to uploaded file
        data_model_schema: Schema definition
        column_mapping: Optional mapping of file columns to schema fields
    
    Returns:
        Tuple of (processed_dataframe, validation_results)
    """
    try:
        # Read file
        df = read_full_file(file_path)
        
        # Apply column mapping if provided
        if column_mapping:
            df = df.rename(columns=column_mapping)
        
        validation_results = {
            "total_rows": len(df),
            "valid_rows": 0,
            "invalid_rows": 0,
            "errors": []
        }
        
        # Validate against schema
        schema_fields = {field['name']: field for field in data_model_schema}
        
        for field_name, field_def in schema_fields.items():
            if field_name not in df.columns:
                if field_def.get('required', False):
                    validation_results['errors'].append({
                        "field": field_name,
                        "error": "Required field missing"
                    })
                continue
            
            # Type conversion and validation
            try:
                if field_def['type'] == 'number':
                    df[field_name] = pd.to_numeric(df[field_name], errors='coerce')
                elif field_def['type'] == 'date':
                    df[field_name] = pd.to_datetime(df[field_name], errors='coerce')
                elif field_def['type'] == 'boolean':
                    df[field_name] = df[field_name].astype(bool)
            except Exception as e:
                validation_results['errors'].append({
                    "field": field_name,
                    "error": f"Type conversion error: {str(e)}"
                })
        
        # Count valid rows (rows without null values in required fields)
        required_fields = [f['name'] for f in data_model_schema if f.get('required', False)]
        if required_fields:
            valid_mask = df[required_fields].notna().all(axis=1)
            validation_results['valid_rows'] = valid_mask.sum()
            validation_results['invalid_rows'] = (~valid_mask).sum()
        else:
            validation_results['valid_rows'] = len(df)
        
        return df, validation_results
        
    except Exception as e:
        logger.error(f"Error processing upload: {e}")
        raise


def save_upload_file(file, upload_dir: str = None) -> str:
    """
    Save uploaded file to disk
    
    Args:
        file: File object
        upload_dir: Directory to save file (default: settings.UPLOAD_DIR)
    
    Returns:
        Path to saved file
    """
    if upload_dir is None:
        upload_dir = settings.UPLOAD_DIR
    
    # Create directory if it doesn't exist
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    timestamp = pd.Timestamp.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{file.filename}"
    file_path = os.path.join(upload_dir, filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = file.file.read()
        buffer.write(content)
    
    return file_path