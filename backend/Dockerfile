################## INSTALL DEPENDENCIES ##################

# This stage runs with the build context ( as working directory )
FROM python:3.11-slim as builder

WORKDIR /build

COPY requirements.txt .

# Install dependencies
RUN pip install --user -r requirements.txt # ← Installs to /root/.local

################## RUN APPLICATION ##################

# This stage runs with the build context ( as working directory )
FROM python:3.11-slim

WORKDIR /backend

COPY --from=builder /root/.local /root/.local

# Copy the application code
COPY ./app ./
COPY .env ./

ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
