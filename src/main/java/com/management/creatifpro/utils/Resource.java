package com.management.creatifpro.utils;

public class Resource {

    public static final String API = "/api";

    public static class POINTAGE {
        public static final String POINTAGES = API + "/pointages";
        public static final String CREATE_POINTAGE_HORAIRE = "/horaires/create";
        public static final String CREATE_POINTAGE_SALARIE = "/salaries/create";
        public static final String UPDATE_POINTAGE_HORAIRE = "/horaires/update";
        public static final String UPDATE_POINTAGE_SALARIE = "/salaries/update";
        public static final String DELETE_POINTAGE = "/{id}";
        public static final String GET_POINTAGE_HORAIRE_BY_ID = "/horaires/{id}";
        public static final String GET_POINTAGE_SALARIE_BY_ID = "/salaries/{id}";
        public static final String EXPORT_POINTAGE = "/export";
    }

    public static class PROJECT {
        public static final String PROJECTS = API + "/projects";
        public static final String EMPLOYEES = API + "/employees";
    }

    public static class AUTH {
        public static final String LOGIN = API + "/login";
        public static final String REGISTER = API + "/register";
    }
}
