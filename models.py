from datetime import datetime
from uuid import uuid4
from sqlalchemy import (
    Boolean, CheckConstraint, Column, DateTime,
    ForeignKey, Integer, SmallInteger, String,
    Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    name       = Column(Text, nullable=False)
    email      = Column(Text, unique=True, nullable=False)
    phone      = Column(Text, unique=True)
    plan       = Column(String(10), nullable=False, default="free")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("plan IN ('free','paid')", name="ck_user_plan"),
    )

    results       = relationship("PsychometricResult", back_populates="user", lazy="dynamic")
    enrollments   = relationship("CourseEnrollment",   back_populates="user", lazy="dynamic")
    completions   = relationship("TaskCompletion",     back_populates="user", lazy="dynamic")
    registrations = relationship("WebinarRegistration",back_populates="user", lazy="dynamic")


class PsychometricResult(Base):
    __tablename__ = "psychometric_results"

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id           = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    trait_scores      = Column(JSONB, nullable=False, default=dict)
    career_matches    = Column(JSONB, nullable=False, default=list)
    strengths         = Column(JSONB, nullable=False, default=list)
    personality_type  = Column(Text)        # e.g. "INTJ"
    personality_label = Column(Text)        # e.g. "The Architect"
    overall_score     = Column(SmallInteger)
    is_sample         = Column(Boolean, nullable=False, default=True)
    taken_at          = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint("overall_score BETWEEN 0 AND 100", name="ck_overall_score"),
    )

    user = relationship("User", back_populates="results")


class Course(Base):
    __tablename__ = "courses"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title       = Column(Text, nullable=False)
    description = Column(Text)
    total_weeks = Column(SmallInteger, nullable=False, default=6)
    is_premium  = Column(Boolean, nullable=False, default=False)

    enrollments = relationship("CourseEnrollment", back_populates="course")
    weeks       = relationship("Week", back_populates="course", order_by="Week.week_number")


class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id        = Column(UUID(as_uuid=True), ForeignKey("users.id",   ondelete="CASCADE"), nullable=False)
    course_id      = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    progress_pct   = Column(SmallInteger, nullable=False, default=0)
    enrolled_at    = Column(DateTime(timezone=True), server_default=func.now())
    last_active_at = Column(DateTime(timezone=True))

    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_enrollment"),
        CheckConstraint("progress_pct BETWEEN 0 AND 100", name="ck_progress"),
    )

    user   = relationship("User",   back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")


class Week(Base):
    __tablename__ = "weeks"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    course_id   = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    week_number = Column(SmallInteger, nullable=False)
    title       = Column(Text, nullable=False)
    is_premium  = Column(Boolean, nullable=False, default=True)

    __table_args__ = (
        UniqueConstraint("course_id", "week_number", name="uq_week"),
    )

    course = relationship("Course", back_populates="weeks")
    tasks  = relationship("Task", back_populates="week", order_by="Task.day_number")


class Task(Base):
    __tablename__ = "tasks"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    week_id       = Column(UUID(as_uuid=True), ForeignKey("weeks.id", ondelete="CASCADE"), nullable=False)
    day_number    = Column(SmallInteger, nullable=False)
    title         = Column(Text, nullable=False)
    description   = Column(Text)
    type          = Column(String(20), nullable=False, default="worksheet")
    resource_url  = Column(Text)
    duration_mins = Column(SmallInteger)

    __table_args__ = (
        UniqueConstraint("week_id", "day_number", name="uq_task_day"),
        CheckConstraint("type IN ('video','worksheet','pdf','link')", name="ck_task_type"),
        CheckConstraint("day_number BETWEEN 1 AND 7", name="ck_day_number"),
    )

    week        = relationship("Week", back_populates="tasks")
    completions = relationship("TaskCompletion", back_populates="task")


class TaskCompletion(Base):
    __tablename__ = "task_completions"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id",  ondelete="CASCADE"), nullable=False)
    task_id      = Column(UUID(as_uuid=True), ForeignKey("tasks.id",  ondelete="CASCADE"), nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "task_id", name="uq_completion"),
    )

    user = relationship("User", back_populates="completions")
    task = relationship("Task", back_populates="completions")


class Webinar(Base):
    __tablename__ = "webinars"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    title         = Column(Text, nullable=False)
    host_name     = Column(Text)
    host_title    = Column(Text)
    scheduled_at  = Column(DateTime(timezone=True), nullable=False)
    duration_mins = Column(SmallInteger)
    is_premium    = Column(Boolean, nullable=False, default=True)
    meet_url      = Column(Text)

    registrations = relationship("WebinarRegistration", back_populates="webinar")


class WebinarRegistration(Base):
    __tablename__ = "webinar_registrations"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id       = Column(UUID(as_uuid=True), ForeignKey("users.id",    ondelete="CASCADE"), nullable=False)
    webinar_id    = Column(UUID(as_uuid=True), ForeignKey("webinars.id", ondelete="CASCADE"), nullable=False)
    registered_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "webinar_id", name="uq_webinar_reg"),
    )

    user    = relationship("User",    back_populates="registrations")
    webinar = relationship("Webinar", back_populates="registrations")
