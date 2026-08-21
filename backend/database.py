import os

import mysql.connector
from dotenv import load_dotenv


load_dotenv()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "3306")),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "sentimentflow"),
    )


def save_analysis(text, sentiment, positive_score, negative_score, neutral_score):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        query = """
            INSERT INTO analyses (
                text,
                sentiment,
                positive_score,
                negative_score,
                neutral_score
            )
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            text,
            sentiment,
            positive_score,
            negative_score,
            neutral_score,
        )
        cursor.execute(query, values)
        connection.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        connection.close()


def get_analyses():
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                text,
                sentiment,
                positive_score,
                negative_score,
                neutral_score,
                created_at
            FROM analyses
            ORDER BY created_at DESC, id DESC
        """)
        return cursor.fetchall()
    finally:
        cursor.close()
        connection.close()


def get_analysis(analysis_id):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT
                id,
                text,
                sentiment,
                positive_score,
                negative_score,
                neutral_score,
                created_at
            FROM analyses
            WHERE id = %s
        """, (analysis_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        connection.close()


def delete_analysis(analysis_id):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("DELETE FROM analyses WHERE id = %s", (analysis_id,))
        connection.commit()
        return cursor.rowcount > 0
    finally:
        cursor.close()
        connection.close()
