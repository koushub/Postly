package com.postly.Payload;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthorDto {
    private int id;
    private String name;
    private String about;
    // No email, no role, no password
}