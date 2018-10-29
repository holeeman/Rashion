# Rahsion
Make Fashion Great Always!
## Getting Started

Below is step by step process of getting the server to work!

### Prerequisites

You need to have the following installed and setup
- mysql
- node.js
- python with open cv module

### Setting Up the Server

You first need to set up a database called sns.

first run mysql inside terminal or cmd.

```bash
mysql -u root -p
```

or

```bash
mysql -u <username> -p
```

inside the mysql command line, run following command to make sns database

```sql
CREATE DATABASE sns;
```

Then you want to use that database to create a necessary table

```sql
USE sns;
```

Now you want to create a table called photos. This is where information of photos are going to be stored.

```sql
CREATE TABLE `photos` (`id` int(11) NOT NULL, `path` varchar(260) NOT NULL, `rating` int(11) NOT NULL, `voted` int(11) NOT NULL);
```

Make 'id' column of the photos primary key

```sql
ALTER TABLE `photos` ADD PRIMARY KEY (`id`);
```

Make 'id' column to auto increment

```sql
ALTER TABLE `photos` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;
```

Now you can exit the mysql command line by

```sql
exit;
```

Now you need to put your database information in server.js

go to the project folder, and open the server.js file.

you will see the folowing code:

```javascript
// you need to put your database info!
var con = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "sns"
});
```

set user: "" to your username.
set password: "" to your password.

You are all set!

Now run following command on terminal or cmd to run the server.

```bash
node server.js
```
