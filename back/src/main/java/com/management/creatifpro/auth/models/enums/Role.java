package com.management.creatifpro.auth.models.enums;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public enum Role {
    SUPER_ADMIN(0),
    ADMIN(1),
    POINTEUR(2);

    private final int level;

    Role(int level) {
        this.level = level;
    }

    public int getLevel() {
        return level;
    }

    /**
     * Returns the list of roles that this role can assign to new users.
     * A role can assign any role with a strictly higher level (lower privilege).
     */
    public List<Role> getAssignableRoles() {
        return Arrays.stream(Role.values())
                .filter(r -> r.level > this.level)
                .collect(Collectors.toList());
    }

    /**
     * Checks if this role can assign the given target role.
     */
    public boolean canAssign(Role target) {
        return target.level > this.level;
    }

    /**
     * Checks if this role can delete a user with the given target role.
     */
    public boolean canDelete(Role target) {
        return target.level > this.level;
    }
}

