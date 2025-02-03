import yaml
import os

# Load configuration
with open(os.path.join(os.path.dirname(__file__), 'config.yaml'), 'r') as f:
    config = yaml.safe_load(f)