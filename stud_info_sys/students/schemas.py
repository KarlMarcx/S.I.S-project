from ninja import Schema
from datetime import date

class StudentIn(Schema):
    full_name: str
    email: str
    date_of_birth: date
    phone: str
    address: str
    year: int

class StudentOut(Schema):
    id: int
    full_name: str
    email: str
    date_of_birth: date
    phone: str
    address: str
    year: int