from .repositories import StudentRepository
from .models import Student
from typing import List
from ninja.errors import HttpError

class StudentService:

    @staticmethod
    def list_students() -> List[Student]:
        return StudentRepository.get_all()

    @staticmethod
    def get_student_by_id(student_id: int) -> Student:
        student = StudentRepository.get_by_id(student_id)
        if not student:
            raise HttpError(404, f"Student not found")
        return student

    @staticmethod
    def create_student(data: dict) -> Student:
        if StudentRepository.exists_by_email(data["email"]):
            raise HttpError(400, f"Student with email {data.get('email')} already exists.")
        return StudentRepository.create(data)

    @staticmethod
    def update_student(student_id: int, data: dict) -> Student:
        student = StudentRepository.get_by_id(student_id)
        if not student:
            raise HttpError(404, f"Student not found")
        return StudentRepository.update(student, data)

    @staticmethod
    def delete_student(student_id: int) -> None:
        student = StudentRepository.get_by_id(student_id)
        if not student:
            raise HttpError(404, f"Student with id {student_id} not found")
        StudentRepository.delete(student)