# First Stage: Build Dependencies
FROM python:3.10-slim AS builder

WORKDIR /usr/src/scraper

# Check if requirements.txt exists, create it if missing
RUN echo "requests==2.31.0\nbeautifulsoup4==4.12.2\npandas==2.0.3" > requirements.txt

# Copy requirements.txt into the container
COPY requirements.txt ./

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Second Stage: Run Application
FROM python:3.10-slim

WORKDIR /usr/src/scraper

# Copy installed Python packages from the builder stage
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages

# Copy the rest of the scraper code
COPY . .

# Command to run the scraper
CMD ["python", "scraper.py"]
