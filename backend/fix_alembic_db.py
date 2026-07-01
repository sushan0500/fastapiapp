import psycopg2

conn = psycopg2.connect('postgresql://postgres:Akrithi%40123@localhost:5432/student_db')
cur = conn.cursor()
cur.execute("UPDATE alembic_version SET version_num = %s", ('base',))
conn.commit()
cur.close()
conn.close()
print('patched alembic_version to base')
