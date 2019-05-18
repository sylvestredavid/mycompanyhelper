package com.stockmaga.back.services.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.amazonaws.HttpMethod;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.services.IFileService;

@Service
public class FileService implements IFileService {

	@Autowired
	private Environment env;
	/**
	 * authentification auprès d'aws
	 * @return AmazonS3 l'user authentifié
	 */
	public AmazonS3 createUser() {
		AWSCredentials credentials = new BasicAWSCredentials(env.getProperty("aws.accesskey"), env.getProperty("aws.secretkey"));
		return AmazonS3ClientBuilder
				  .standard()
				  .withCredentials(new AWSStaticCredentialsProvider(credentials))
				  .withRegion(Regions.EU_WEST_3)
				  .build();
	}

	/**
	 * upload d'une image
	 * on parcoure la liste des images déjà uploadées, si l'une d'elle porte déjà le même nom, on retourne une bad_request
	 */
	@Override
	public ResponseEntity<?> uploadFile(File file) throws IOException {
		ObjectListing objectListing = createUser().listObjects("powersell");
		for(S3ObjectSummary os : objectListing.getObjectSummaries()) { 
		    if(file.getName().equals(os.getKey())) {
		    	return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("fichier existant"));
		    }
		}
		createUser().putObject("powersell", file.getName(), file);
		return ResponseEntity.status(HttpStatus.OK).body(new Reponse("fichier uploadé."));

	}

	/**
	 * recuperer une image pour l'afficher
	 * aws empeche ceux qui ne sont pas connectés de voir les fichiers
	 * avec cette fonction, on se connecte, genere un url vers l'image et l'envoi au front qui peut
	 * afficher l'image
	 */
	@Override
	public Resource getFile(String filename) throws MalformedURLException {
		GeneratePresignedUrlRequest generatePresignedUrlRequest = 
                new GeneratePresignedUrlRequest("powersell", filename)
                .withMethod(HttpMethod.GET);
        URL url = createUser().generatePresignedUrl(generatePresignedUrlRequest);
		return new UrlResource(url);
	}

	/**
	 * suppression d'une image
	 */
	@Override
	public void deleteFile(String nom) {
		createUser().deleteObject("powersell", nom);

	}

}
