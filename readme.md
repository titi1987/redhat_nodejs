# Project Setup Guide

This guide outlines the steps for setting up and configuring a Red Hat Enterprise Linux hosted Node.js web application, including infrastructure provisioning, identity management, SSL certification, storage solutions, and more.

## Project Purpose

This project is designed to leverage Red Hat Enterprise's robust, secure, and commercially viable environment for hosting a Node.js web application. The key objectives of the project include:

- **Identity Management**: Setting up an Identity Management (IdM) provider using Kerberos and LDAP for secure authentication processes.
- **SSL Certificate Management**: Managing SSL certificates to secure browser-to-web server communications, alongside X.509 certificates for authenticating identity server-to-client communications.
- **PostgreSQL Backup Automation**: Automating PostgreSQL database backups with bash scripting and scheduling these backups with cron jobs to ensure data integrity and availability.
- **ISCSI Storage**: Implementing ISCSI, a block storage solution using IP technology, to provide a high-availability and scalable storage solution suitable for data-intensive web applications, particularly when using AWS EBS.
- **NGINX Web Server Proxy**: Utilizing NGINX for its ability to handle a large number of simultaneous connections, and configuring it as a reverse proxy to other web servers. This enhances the scalability, performance, resilience, and security of the web application.

Through these components, the project aims to create a secure, reliable, and high-performance web application hosting environment that can serve as a solid foundation for both learning and practical application in a commercial setting.


## Infrastructure Setup

### AWS EC2 Red Hat Instances

- **Provision Instances**: Provision two AWS EC2 instances with Red Hat Enterprise Linux.
- **Register with Red Hat**: Register the EC2 instances to your Red Hat subscription for updates and support.

### Domain Name System (DNS) Configuration

- **DreamHost DNS Setup**: Configure A records for the Identity Management (IdM) server and the web server in DreamHost to point to the EC2 instances' public IP addresses.

### Security Group Configuration

- **AWS Security Group**: Ensure the security group allows inbound traffic on the necessary ports for IdM (LDAP, DNS, Kerberos), iSCSI, and NGINX.

## Storage and Identity Management

### iSCSI Storage Configuration

- **Configure Target Server**:
  - Install `scsi-target-utils`.
  - Use `fdisk` to create a new partition.
  - Modify the `/etc/tgt/targets.conf` file accordingly.
- **Configure iSCSI Initiator**:
  - Install `iscsi-initiator-utils` on another machine.
  - Connect to the target server and authenticate using saved credentials.
  - Create and mount the file system for persistent storage on the web server.

### Identity Management (IdM) Server Setup

- **Install IdM Server**: `sudo yum install ipa-server ipa-server-dns -y`.
- **Configure DNS**: Use the integrated DNS server, set up DNS zones, forwarders, and create A records for both IdM and web servers.
- **User Management**: Create new users as needed.

## Web Server Configuration

- **Install IPA Client**: `yum install ipa-client`.
- **Domain Join**: `sudo ipa-client-install --mkhomedir --server=idm.cloudsavvy.online --domain=cloudsavvy.online`.
- **Test Authentication**: Ensure proper configuration by signing in and testing authentication with the IdM server.

## Application Deployment

### Environment Setup

- **Update Red Hat Packages**: Ensure all packages are up to date.
- **Clone Application**: Clone the application code from your GitHub repository.
- **Install Dependencies**:
  - `sudo yum install -y epel-release`.
  - `sudo yum install -y nodejs`.
- **Web Server (NGINX) Configuration**: 
  - Install NGINX and configure it as a reverse proxy.
  - Obtain and configure an SSL certificate from Let's Encrypt in `/etc/nginx/nginx.conf`.

### Database Setup

- **PostgreSQL Installation**: `sudo yum install -y postgresql-server postgresql-contrib`.
- **Start and Enable PostgreSQL**: 
  - `sudo systemctl start postgresql`.
  - `sudo systemctl enable postgresql`.
- **Database Configuration**: 
  - Alter the default postgres user password.
  - Configure `pg_hba.conf` for local connections.
  - Create the necessary database and tables.
  - Update connection strings in the Node.js app accordingly.

### Application Management with PM2

- **Install PM2**: `npm install pm2 -g`.
- **Configure and Start Application**: 
  - `pm2 start app.js --name "nodejs-app"`.
  - Configure PM2 to automatically start the application on boot.

## Backup Automation

- **Backup Script**: Create a bash script (`backup_postgres.sh`) for daily database backups.
- **Cron Job**: Schedule the backup script to run daily.
- **Permissions**: Ensure the backup script is executable with `chmod +x backup_postgres.sh`.

### Monitoring Cron Jobs

- **Log Verification**: Check cron job execution and status in the logs with `sudo grep -a CRON /var/log/syslog`.

This guide provides a comprehensive walkthrough for setting up a Node.js web application on Red Hat Enterprise Linux, including all necessary components and configurations for a secure, scalable, and maintainable deployment.
