from ninja import Router
from typing import List
from .schemas import StudentIn, StudentOut
from .services import StudentService

router = Router(tags=["Students"])

@router.get("/", response=List[StudentOut])
def get_students_router(request):
    students = StudentService.list_students()
    return students

@router.get("/{student_id}", response=StudentOut)
def get_student_router(request, student_id: int):
    student = StudentService.get_student_by_id(student_id)
    return student

@router.post("/", response=StudentOut)
def create_student_router(request, payload: StudentIn):
    student = StudentService.create_student(payload.dict())
    return student

@router.patch("/{student_id}", response=StudentOut)
def update_student_router(request, student_id: int, payload: StudentIn):
    student = StudentService.update_student(student_id, payload.dict())
    return student

@router.delete("/{student_id}", response={204: None, 404: dict})
def delete_student_router(request, student_id: int): 
    StudentService.delete_student(student_id)
    return 204, None