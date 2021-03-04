import sqlite3;

class Schema:
    def __init__ (self):
        self.conn = sqlite3.connect('feedback.db')
        self.create_table()
    
    def __del__ (self):
        self.conn.commit()
        self.conn.close()
    
    def create_table(self):
        query = """
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY,
            Name TEXT,
            Age INTEGER,
            Gender INTEGER,
            Email TEXT,
            Feedback TEXT
        );"""
        cur = self.conn.cursor()
        cur.execute(query)

class FeedbackModel:
    def __init__ (self):
        self.conn = sqlite3.connect('feedback.db')
        self.conn.row_factory = sqlite3.Row

    def __del__(self):
        self.conn.commit()
        self.conn.close()

    def create(self, params):
        p = (params['Name'], params['Age'], params['Gender'], params['Email'], params['Feedback'])
        query = f'INSERT INTO feedback ' \
                f'(Name, Age, Gender, Email, Feedback)' \
                f'values (?,?,?,?,?);'
        cur = self.conn.cursor()
        result = cur.execute(query, p)
        # print(result)
        # print(query)
        return self.list_items()

    def delete(self, id):
        query = f'DELETE FROM feedback ' \
                f'WHERE id = ?;'
        cur = self.conn.cursor()
        result = cur.execute(query, id)
        # print(query)
        return self.list_items()

    def update(self, params):
        p = (params['Name'], params['Age'], params['Gender'], params['Email'], params['Feedback'], params['id'])
        query = f'UPDATE feedback ' \
                f'SET Name = ?, ' \
                f'Age = ?, ' \
                f'Gender = ?, ' \
                f'Email = ?, ' \
                f'Feedback = ? ' \
                f'WHERE id = ?;'  
        # print(query)
        cur = self.conn.cursor()
        cur.execute(query, p)
        return self.list_items()

    def list_items(self):
        query = f'SELECT id, Name, Email, Age, Gender, Feedback ' \
                f'FROM feedback;'
        cur = self.conn.cursor()
        result_set = cur.execute(query).fetchall()
        result = [{column: row[i]
                  for i, column in enumerate(result_set[0].keys())}
                  for row in result_set]
        # print(result)
        return result