package com.campus.emergency.utils;

import org.springframework.web.multipart.MultipartFile;

public class ImageValidator {
    public static boolean isFromCamera(MultipartFile file) {
        return file != null && !file.getOriginalFilename().contains("gallery");
    }
}