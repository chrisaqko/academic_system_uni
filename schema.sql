-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.academic_history (
  id_history bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_user bigint NOT NULL,
  id_course bigint NOT NULL,
  quarter character varying NOT NULL,
  year date NOT NULL,
  notes character varying,
  grade numeric NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT academic_history_pkey PRIMARY KEY (id_history),
  CONSTRAINT academic_history_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.user(id_user),
  CONSTRAINT academic_history_id_course_fkey FOREIGN KEY (id_course) REFERENCES public.course(id_course),
  CONSTRAINT academic_history_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.address (
  id_address bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_country bigint,
  id_province bigint,
  CONSTRAINT address_pkey PRIMARY KEY (id_address),
  CONSTRAINT address_id_country_fkey FOREIGN KEY (id_country) REFERENCES public.country(id_country),
  CONSTRAINT address_id_province_fkey FOREIGN KEY (id_province) REFERENCES public.province(id_province)
);
CREATE TABLE public.classrom (
  id_classrom bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  n_classrom character varying NOT NULL,
  capacity smallint NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT classrom_pkey PRIMARY KEY (id_classrom),
  CONSTRAINT classrom_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.country (
  id_country bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  country character varying NOT NULL,
  CONSTRAINT country_pkey PRIMARY KEY (id_country)
);
CREATE TABLE public.course (
  id_course bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  credits smallint NOT NULL,
  quota smallint NOT NULL,
  id_status bigint,
  CONSTRAINT course_pkey PRIMARY KEY (id_course),
  CONSTRAINT course_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.course_classrom (
  id_course bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_schedule bigint NOT NULL,
  id_classrom bigint NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT course_classrom_pkey PRIMARY KEY (id_course, id_schedule, id_classrom),
  CONSTRAINT course_classrom_id_course_fkey FOREIGN KEY (id_course) REFERENCES public.course(id_course),
  CONSTRAINT course_classrom_id_schedule_fkey FOREIGN KEY (id_schedule) REFERENCES public.schedule(id_schedule),
  CONSTRAINT course_classrom_id_classrom_fkey FOREIGN KEY (id_classrom) REFERENCES public.classrom(id_classrom),
  CONSTRAINT course_classrom_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.courses_program (
  id_course bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_program bigint NOT NULL,
  id_status bigint,
  CONSTRAINT courses_program_pkey PRIMARY KEY (id_course, id_program),
  CONSTRAINT courses_program_id_course_fkey FOREIGN KEY (id_course) REFERENCES public.course(id_course),
  CONSTRAINT courses_program_id_program_fkey FOREIGN KEY (id_program) REFERENCES public.study_program(id_program),
  CONSTRAINT courses_program_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.enrolled_schedule (
  id_enrolled_schedule bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  enrollment_date timestamp without time zone NOT NULL,
  id_user bigint NOT NULL,
  id_course bigint NOT NULL,
  id_schedule bigint NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT enrolled_schedule_pkey PRIMARY KEY (id_enrolled_schedule),
  CONSTRAINT enrolled_schedule_id_course_id_schedule_fkey FOREIGN KEY (id_course) REFERENCES public.schedule_course(id_course),
  CONSTRAINT enrolled_schedule_id_course_id_schedule_fkey FOREIGN KEY (id_schedule) REFERENCES public.schedule_course(id_course),
  CONSTRAINT enrolled_schedule_id_course_id_schedule_fkey FOREIGN KEY (id_course) REFERENCES public.schedule_course(id_schedule),
  CONSTRAINT enrolled_schedule_id_course_id_schedule_fkey FOREIGN KEY (id_schedule) REFERENCES public.schedule_course(id_schedule),
  CONSTRAINT enrolled_schedule_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.user(id_user),
  CONSTRAINT enrolled_schedule_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.province (
  id_province bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  province character varying NOT NULL,
  CONSTRAINT province_pkey PRIMARY KEY (id_province)
);
CREATE TABLE public.related_course (
  id_requirement bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_course bigint NOT NULL,
  id_required_course bigint NOT NULL,
  relation character varying NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT related_course_pkey PRIMARY KEY (id_requirement),
  CONSTRAINT related_course_id_course_fkey FOREIGN KEY (id_course) REFERENCES public.course(id_course),
  CONSTRAINT related_course_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status),
  CONSTRAINT related_course_id_required_course_fkey FOREIGN KEY (id_required_course) REFERENCES public.course(id_course)
);
CREATE TABLE public.schedule (
  id_schedule bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  week_day character varying,
  shift character varying,
  id_status bigint NOT NULL,
  CONSTRAINT schedule_pkey PRIMARY KEY (id_schedule),
  CONSTRAINT schedule_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.schedule_course (
  id_course bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_schedule bigint NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT schedule_course_pkey PRIMARY KEY (id_course, id_schedule),
  CONSTRAINT schedule_course_id_course_fkey FOREIGN KEY (id_course) REFERENCES public.course(id_course),
  CONSTRAINT schedule_course_id_schedule_fkey FOREIGN KEY (id_schedule) REFERENCES public.schedule(id_schedule),
  CONSTRAINT schedule_course_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.status (
  id_status bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  description boolean NOT NULL DEFAULT true,
  CONSTRAINT status_pkey PRIMARY KEY (id_status)
);
CREATE TABLE public.study_program (
  id_program bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  career_name character varying NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT study_program_pkey PRIMARY KEY (id_program),
  CONSTRAINT study_program_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.teacher_allocation (
  id_allocation bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_user bigint,
  id_course bigint,
  id_schedule bigint,
  id_status bigint,
  CONSTRAINT teacher_allocation_pkey PRIMARY KEY (id_allocation),
  CONSTRAINT teacher_allocation_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.user(id_user),
  CONSTRAINT teacher_allocation_id_course_id_schedule_fkey FOREIGN KEY (id_course) REFERENCES public.schedule_course(id_course),
  CONSTRAINT teacher_allocation_id_course_id_schedule_fkey FOREIGN KEY (id_schedule) REFERENCES public.schedule_course(id_course),
  CONSTRAINT teacher_allocation_id_course_id_schedule_fkey FOREIGN KEY (id_course) REFERENCES public.schedule_course(id_schedule),
  CONSTRAINT teacher_allocation_id_course_id_schedule_fkey FOREIGN KEY (id_schedule) REFERENCES public.schedule_course(id_schedule),
  CONSTRAINT teacher_allocation_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.teaching_specialization (
  id_specialization bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  specialization_area character varying NOT NULL,
  id_status bigint NOT NULL,
  CONSTRAINT teaching_specialization_pkey PRIMARY KEY (id_specialization),
  CONSTRAINT teaching_specialization_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status)
);
CREATE TABLE public.user (
  id_user bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name character varying NOT NULL,
  surname character varying NOT NULL,
  second_surname character varying,
  email character varying NOT NULL UNIQUE,
  user_type character varying NOT NULL DEFAULT 'student'::character varying,
  country_code smallint,
  phone_number character varying,
  id_status bigint NOT NULL,
  id_address smallint NOT NULL,
  id_specialization smallint NOT NULL,
  CONSTRAINT user_pkey PRIMARY KEY (id_user),
  CONSTRAINT user_id_status_fkey FOREIGN KEY (id_status) REFERENCES public.status(id_status),
  CONSTRAINT user_id_specialization_fkey FOREIGN KEY (id_specialization) REFERENCES public.teaching_specialization(id_specialization),
  CONSTRAINT user_id_address_fkey FOREIGN KEY (id_address) REFERENCES public.address(id_address)
);