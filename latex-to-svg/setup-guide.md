# LaTeX to SVG Converter Setup Guide

## 1. Server Setup

```bash
# Update the system
sudo dnf update -y

# Install EPEL repository
sudo dnf install \
    https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm \
    https://dl.fedoraproject.org/pub/epel/epel-next-release-latest-9.noarch.rpm

# Install Apache and PHP
sudo dnf install httpd php php-fpm -y

# Start and enable Apache and PHP-FPM
sudo systemctl start httpd
sudo systemctl enable httpd
sudo systemctl start php-fpm
sudo systemctl enable php-fpm
```

## 2. Install TeX Live and Dependencies

```bash
# Install TeX Live
sudo dnf install texlive-scheme-basic texlive-collection-latex texlive-collection-latexextra -y

# Install development tools for building pdf2svg
sudo dnf groupinstall "Development Tools" -y
sudo dnf install cairo-devel poppler-devel -y

# Download and compile pdf2svg
cd /tmp
wget https://github.com/dawbarton/pdf2svg/archive/refs/tags/v0.2.3.tar.gz
tar xf v0.2.3.tar.gz
cd pdf2svg-0.2.3
./configure
make
sudo make install
```

## 3. Configure PHP and Apache

```bash
# Create PHP-FPM configuration
sudo tee /etc/php-fpm.d/www.conf << 'EOF'
[www]
user = apache
group = apache
listen = /var/run/php-fpm/www.sock
listen.owner = apache
listen.group = apache
listen.mode = 0660
pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
EOF

# Create PHP configuration for Apache
sudo tee /etc/httpd/conf.d/php.conf << 'EOF'
<FilesMatch \.php$>
    SetHandler "proxy:unix:/var/run/php-fpm/www.sock|fcgi://localhost"
</FilesMatch>
EOF

# Restart services
sudo systemctl restart php-fpm
sudo systemctl restart httpd
```

## 4. Set Up Principia Package

```bash
# Create directory for the LaTeX package
sudo mkdir -p /usr/share/texmf/tex/latex/principia

# Create principia.sty
sudo tee /usr/share/texmf/tex/latex/principia/principia.sty << 'EOF'
\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{principia}[2025/01/16 Principia LaTeX macros]

% Required packages
\RequirePackage{newtxtext}
\RequirePackage{pifont}
\RequirePackage{amssymb}
\RequirePackage{graphicx}
\RequirePackage{amsmath}
\RequirePackage[T1]{fontenc}
\RequirePackage[utf8]{inputenc}
\RequirePackage{mathrsfs}
\RequirePackage{rotating}

% Basic commands
\newcommand{\pmd}{\Diamond}
\newcommand{\pmdd}{\Box}
\newcommand{\pmthm}{\vdash}
\newcommand{\pmast}{*}
\newcommand{\pmcdot}{\cdot}
\newcommand{\pmdot}{\bullet}
\newcommand{\pmdott}{\circ}
\newcommand{\pmimp}{\rightarrow}
\newcommand{\pmnot}{\neg}

% Advanced commands with alignment
\newcommand{\pmrlF}[2]{%
    #1 \mathbin{\ooalign{%
        $\upharpoonright$\cr
        \hidewidth\rotatebox[origin=c]{180}{$\upharpoonleft$}\hidewidth\cr
    }} #2%
}
EOF

# Update TeX's filename database
sudo texhash
```

## 5. Create Working Directories

```bash
# Create directories and set permissions
sudo mkdir -p /var/www/html/temp
sudo touch /var/www/html/debug.log
sudo chown -R apache:apache /var/www/html/temp
sudo chown apache:apache /var/www/html/debug.log
sudo chmod 777 /var/www/html/temp
sudo chmod 666 /var/www/html/debug.log
```

## 6. Install API Script

Create the file `/var/www/html/latex-api.php`:

[The complete PHP script from our previous successful implementation goes here]

## 7. Install Frontend

Create the file `/var/www/html/index.html`:

[The complete HTML/CSS/JS frontend from our previous successful implementation goes here]

## 8. Verify Installation

1. Check that Apache user can access required commands:
```bash
sudo -u apache which pdflatex
sudo -u apache which pdf2svg
sudo -u apache kpsewhich principia.sty
```

2. Test PHP processing:
```bash
echo "<?php phpinfo(); ?>" | sudo tee /var/www/html/test.php
```
Visit http://your-server/test.php

3. Test LaTeX conversion:
Visit http://your-server/ and try converting `\pmthm p \pmimp \pmnot p`

## Troubleshooting

1. Check Apache error log:
```bash
sudo tail -f /var/log/httpd/error_log
```

2. Check PHP-FPM log:
```bash
sudo tail -f /var/log/php-fpm/error.log
```

3. Check debug log:
```bash
sudo tail -f /var/www/html/debug.log
```

4. Check file permissions:
```bash
ls -la /var/www/html/
ls -la /var/www/html/temp/
```

5. Verify SELinux isn't blocking access (if enabled):
```bash
sudo setenforce 0  # Temporarily disable SELinux for testing
```

## Security Notes

1. The temp directory should be regularly cleaned of old files
2. Consider implementing rate limiting
3. Consider adding input validation for LaTeX commands
4. Monitor disk space usage
5. Keep all packages updated

## Maintenance

1. Regular updates:
```bash
sudo dnf update -y
```

2. Clear temporary files:
```bash
sudo rm -rf /var/www/html/temp/latex-*
```

3. Rotate logs:
```bash
sudo logrotate -f /etc/logrotate.d/httpd
```
