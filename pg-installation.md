### Installing Postgres in Linux
Postgres [ https://www.postgresql.org/download/linux/ubuntu/ ]

### Commands
- `sudo apt install -y postgresql-common`
- `sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh`
- `sudo apt install postgresql-18`
- Verify if pg_dump is installed using `pg_dump --version`

### Manual Installation 

```
sudo apt install curl ca-certificates
sudo install -d /usr/share/postgresql-common/pgdg
sudo curl -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc --fail https://www.postgresql.org/media/keys/ACCC4CF8.asc
. /etc/os-release
sudo sh -c "echo 'deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt $VERSION_CODENAME-pgdg main' > /etc/apt/sources.list.d/pgdg.list"
sudo apt update

```
