import psycopg2

conn = psycopg2.connect(dbname='postgres', user='postgres', password='Akrithi@123', host='localhost')
conn.autocommit = True
cur = conn.cursor()
cur.execute("SELECT 1 FROM pg_database WHERE datname = 'student_db'")
exists = cur.fetchone()
if not exists:
    cur.execute("CREATE DATABASE student_db")
    print('created database student_db')
else:
    print('database student_db already exists')
cur.close()
conn.close()
