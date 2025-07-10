# Self-Hosting PostgreSQL Guide

## Overview

This guide helps you set up PostgreSQL on your own server instead of using paid hosting services. This can save you $19+/month compared to managed services.

## Cost Comparison

| Option | Monthly Cost | Setup Time | Maintenance |
|--------|-------------|------------|-------------|
| **Self-hosted VPS** | $4-10 | 30 minutes | Low |
| **Managed (Neon)** | $19+ | 5 minutes | None |
| **Managed (Supabase)** | $0 (free tier) | 5 minutes | None |

## Recommended VPS Providers

### Budget Options ($4-6/month)
- **Hetzner Cloud**: €4.15/month (1 vCPU, 2GB RAM, 20GB SSD)
- **DigitalOcean**: $6/month (1 vCPU, 1GB RAM, 25GB SSD)
- **Linode**: $5/month (1 vCPU, 1GB RAM, 25GB SSD)
- **Vultr**: $5/month (1 vCPU, 1GB RAM, 25GB SSD)

### Premium Options ($10-20/month)
- **AWS EC2**: t3.micro ~$10/month
- **Google Cloud**: e2-micro ~$8/month
- **Azure**: B1s ~$15/month

## Installation Steps

### 1. Create Your VPS

Choose a provider and create an Ubuntu 22.04 LTS server with at least:
- 1 vCPU
- 2GB RAM (recommended for PostgreSQL)
- 20GB storage

### 2. Connect to Your Server

```bash
ssh root@your-server-ip
```

### 3. Install PostgreSQL

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create your database and user
CREATE DATABASE processflow;
CREATE USER processflow_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE processflow TO processflow_user;

# Exit psql
\q
```

### 5. Configure Remote Access

Edit PostgreSQL configuration:

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and modify this line:
listen_addresses = '*'

# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line at the end:
host    all             all             0.0.0.0/0               md5
```

### 6. Configure Firewall

```bash
# Allow PostgreSQL port
sudo ufw allow 5432/tcp

# Enable firewall (if not already enabled)
sudo ufw enable

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 7. Test Connection

From your local machine:

```bash
# Test connection (replace with your server IP)
psql -h your-server-ip -U processflow_user -d processflow -W
```

## Environment Configuration

Set your `DATABASE_URL` environment variable:

```bash
# For your ProcessFlow app
DATABASE_URL=postgresql://processflow_user:your-secure-password@your-server-ip:5432/processflow
```

## Security Best Practices

### 1. Use Strong Passwords
```bash
# Generate a secure password
openssl rand -base64 32
```

### 2. Restrict Access
```bash
# Edit pg_hba.conf to allow only your app's IP
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Replace 0.0.0.0/0 with your specific IP or subnet
host    all             all             your-app-ip/32         md5
```

### 3. Enable SSL
```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Enable SSL
ssl = on
ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'
```

### 4. Set Up Automatic Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-postgres.sh

#!/bin/bash
BACKUP_DIR="/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="processflow"

mkdir -p $BACKUP_DIR
pg_dump -h localhost -U processflow_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete

# Make it executable
sudo chmod +x /usr/local/bin/backup-postgres.sh

# Add to crontab for daily backups
sudo crontab -e
# Add this line:
0 2 * * * /usr/local/bin/backup-postgres.sh
```

## Monitoring

### Check PostgreSQL Status
```bash
sudo systemctl status postgresql
```

### View Logs
```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Monitor Connections
```bash
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"
```

## Maintenance

### Regular Updates
```bash
# Update system packages monthly
sudo apt update && sudo apt upgrade -y

# Restart PostgreSQL if needed
sudo systemctl restart postgresql
```

### Database Maintenance
```bash
# Connect to database
sudo -u postgres psql -d processflow

# Run maintenance commands
VACUUM ANALYZE;
REINDEX DATABASE processflow;
```

## Migration from Neon

If you're migrating from an existing Neon database:

1. **Export from Neon:**
```bash
pg_dump "your-neon-connection-string" > neon_backup.sql
```

2. **Import to Self-hosted:**
```bash
psql -h your-server-ip -U processflow_user -d processflow -f neon_backup.sql
```

3. **Update your app's DATABASE_URL** to point to your self-hosted instance

## Troubleshooting

### Connection Issues
- Check firewall settings: `sudo ufw status`
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check if port 5432 is open: `sudo netstat -tlnp | grep 5432`

### Permission Issues
- Ensure database user has correct permissions
- Check pg_hba.conf configuration
- Verify password authentication

### Performance Issues
- Monitor resource usage: `htop`
- Check PostgreSQL logs for slow queries
- Consider increasing shared_buffers in postgresql.conf

## Cost Analysis

### Monthly Costs (Self-hosted)
- **VPS**: $4-10/month
- **Backup storage**: $0-2/month
- **Monitoring**: $0 (free tools)
- **Total**: $4-12/month

### vs. Managed Services
- **Self-hosted**: $4-12/month
- **Neon Pro**: $19/month
- **Supabase Pro**: $25/month

**Savings**: $7-21/month ($84-252/year)

## When to Use Self-hosting

**Choose self-hosting if:**
- You want maximum cost savings
- You need full control over your database
- You have basic Linux administration skills
- You can handle occasional maintenance

**Choose managed services if:**
- You prefer zero maintenance
- You need advanced features (branching, serverless)
- You want built-in monitoring and alerts
- Time is more valuable than cost savings