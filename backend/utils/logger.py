"""
Svastrino Logger
Configures a shared logger that writes to both console and file.
"""

import logging
import os

# Resolve log file path relative to the backend folder
LOG_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE = os.path.join(LOG_DIR, "svastrino.log")

# Create the logger
logger = logging.getLogger("svastrino")
logger.setLevel(logging.INFO)

# Prevent duplicate handlers if module is re-imported
if not logger.handlers:
    # Formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File handler
    file_handler = logging.FileHandler(LOG_FILE, encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
