from .models import Student
from typing import List, Optional

class StudentRepository:

    @staticmethod
    def get_all() -> List[Student]:
        return list(Student.objects.all())
    
    @staticmethod
    def get_by_id(student_id: int) -> Optional[Student]:
        return Student.objects.filter(id=student_id).first()
    
    @staticmethod
    def exists_by_email(email: str) -> bool:
        return Student.objects.filter(email=email).exists()
    
    @staticmethod
    def create(data: dict) -> Student:
        return Student.objects.create(**data)
    
    @staticmethod
    def update(student: Student, data: dict) -> Student:
        for key, value in data:
            setattr(student, key, value)
        student.save()
        return student
    
    @staticmethod
    def delete(student: Student) -> None:
        student.delete()