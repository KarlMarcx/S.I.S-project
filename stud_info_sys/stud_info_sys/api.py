from ninja import NinjaAPI
from students.api import router as student_router
from courses.api import router as courses_router
from semester.api import router as semester_router
from billing.api import router as billing_router
from login.api import router as login_router

api = NinjaAPI()

api.add_router("/", login_router)
api.add_router("/students/", student_router)
api.add_router("/courses/", courses_router)
api.add_router("/semester/", semester_router)
api.add_router("/billing/", billing_router)