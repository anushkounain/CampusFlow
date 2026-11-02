import logging
import sys


def setup_logging():
    """Configure structured logging for CampusFlow."""
    log_format = "%(asctime)s - [%(levelname)s] - %(name)s - %(message)s"
    logging.basicConfig(
        level=logging.INFO,
        format=log_format,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
    )
    return logging.getLogger("campusflow")


logger = setup_logging()
