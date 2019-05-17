package com.stockmaga.back.services;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

public interface IFileService {

	public ResponseEntity<?> uploadFile(File file) throws IOException;

	public Resource getFile(String filename) throws MalformedURLException;

	public void deleteFile(String nom);
}
