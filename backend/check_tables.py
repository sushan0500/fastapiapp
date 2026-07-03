import psycopg2

conn = psycopg2.connect(dbname='student_db', user='postgres', password='Akrithi@123', host='localhost')
cur = conn.cursor()
cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
for row in cur.fetchall():
    print(row[0])
cur.close()
conn.close()
