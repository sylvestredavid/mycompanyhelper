package com.stockmaga.back.services.impl;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.stockmaga.back.models.Annonce;
import com.stockmaga.back.models.Reponse;
import com.stockmaga.back.models.User;
import com.stockmaga.back.repositories.AnnonceRepository;
import com.stockmaga.back.repositories.UserRepository;
import com.stockmaga.back.services.IAbonnementService;
import com.stockmaga.back.services.IEmailService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.Subscription;
import com.stripe.model.SubscriptionItem;
import com.stripe.model.UsageRecord;

@Service
public class AbonnementService implements IAbonnementService {

	@Autowired
	AnnonceRepository annonceRepository;

	@Autowired
	UserRepository userRepository;

	@Autowired
	IEmailService emailService;

	@Autowired
	Environment env;

	/**
	 * augmente le nombre de contacts a chaque mail envoyé en réponse a une annonce
	 * 
	 * @return
	 * @throws StripeException
	 */
	@Override
	public ResponseEntity<?> augmenterNbContacts(Integer id) {
		annonceRepository.augmenterNbContacts(id);
		Optional<Annonce> annonce = annonceRepository.findById(id);
		Optional<User> user = userRepository.findById(annonce.get().getIdFournisseur());

		Stripe.apiKey = env.getProperty("stripe.apikey");
		try {
			Subscription sub = Subscription.retrieve(user.get().getAbonnement());

			Map<String, Object> subscriptionitemParams = new HashMap<String, Object>();
			subscriptionitemParams.put("subscription", sub.getId());
			SubscriptionItem item = SubscriptionItem.list(subscriptionitemParams).getData().get(0);

			Instant instant = Instant.now();
			long timeStamp = instant.getEpochSecond();

			System.out.println(timeStamp);

			Map<String, Object> usagerecordParams = new HashMap<String, Object>();
			usagerecordParams.put("quantity", 1);
			usagerecordParams.put("timestamp", timeStamp);
			UsageRecord.createOnSubscriptionItem(item.getId(), usagerecordParams, null);
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("nb contact augmenté"));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(new Reponse("erreur lors de l'augmentation du nb de contact"));
		}

	}

	@Override
	public ResponseEntity<?> miseEnAvant(String token, Integer idAnnonce) {
		Stripe.apiKey = env.getProperty("stripe.apikey");

		Optional<Annonce> annonce = annonceRepository.findById(idAnnonce);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("amount", 500);
		params.put("currency", "eur");
		params.put("description", "mise en avant de l'annonce " + annonce.get().getTitre());
		params.put("source", token);
		try {
			Charge.create(params);
			annonceRepository.miseEnAvant(idAnnonce);
			emailService.sendMailMiseEnAvant(annonce.get());
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("annonce mis en avant"));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("erreur lors du paiement"));
		}
	}

	@Override
	public ResponseEntity<?> abonement(String token, String email) {
		Stripe.apiKey = env.getProperty("stripe.apikey");
		try {
			// Create a Customer:
			Map<String, Object> params = new HashMap<>();
			params.put("source", token);
			params.put("email", email);
			Customer customer = Customer.create(params);

			Map<String, Object> item = new HashMap<String, Object>();
			item.put("plan", "plan_F2kt3QgaRHVEUK");

			Map<String, Object> items = new HashMap<String, Object>();
			items.put("0", item);

			Map<String, Object> planParams = new HashMap<String, Object>();
			planParams.put("customer", customer.getId());
			planParams.put("items", items);

			Subscription subscription = Subscription.create(planParams);

			return ResponseEntity.status(HttpStatus.OK).body(new Reponse(subscription.getId()));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("erreur lors de la création"));
		}
	}

	@Override
	public ResponseEntity<?> abonementRequete(String token, String email) {
		Stripe.apiKey = env.getProperty("stripe.apikey");
		try {
			// Create a Customer:
			Map<String, Object> params = new HashMap<>();
			params.put("source", token);
			params.put("email", email);
			Customer customer = Customer.create(params);

			Map<String, Object> item = new HashMap<String, Object>();
			item.put("plan", "plan_F3SX3mQa0vS0Ri");

			Map<String, Object> items = new HashMap<String, Object>();
			items.put("0", item);

			Map<String, Object> planParams = new HashMap<String, Object>();
			planParams.put("customer", customer.getId());
			planParams.put("items", items);

			Subscription subscription = Subscription.create(planParams);

			return ResponseEntity.status(HttpStatus.OK).body(new Reponse(subscription.getId()));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("erreur lors de la création"));
		}
	}

	@Override
	public ResponseEntity<?> abonementFournisseur(String token, String email) {
		Stripe.apiKey = env.getProperty("stripe.apikey");
		try {
			// Create a Customer:
			Map<String, Object> params = new HashMap<>();
			params.put("source", token);
			params.put("email", email);
			Customer customer = Customer.create(params);

			Map<String, Object> item = new HashMap<String, Object>();
			item.put("plan", "plan_F36c2RRZRzT5Ac");

			Map<String, Object> items = new HashMap<String, Object>();
			items.put("0", item);

			Map<String, Object> planParams = new HashMap<String, Object>();
			planParams.put("customer", customer.getId());
			planParams.put("items", items);

			Subscription subscription = Subscription.create(planParams);

			return ResponseEntity.status(HttpStatus.OK).body(new Reponse(subscription.getId()));
		} catch (StripeException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("erreur lors de la création"));
		}
	}

	@Override
	public ResponseEntity<?> stopAbonnement(Long idUser) {
		Stripe.apiKey = env.getProperty("stripe.apikey");
		Optional<User> user = userRepository.findById(idUser);
		Subscription sub;
		try {
			sub = Subscription.retrieve(user.get().getAbonnement());
			sub.cancel();
			return ResponseEntity.status(HttpStatus.OK).body(new Reponse("abonnement stoppé"));
		} catch (StripeException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("erreur lors de l'annulation"));
		}
	}

	@Override
	public void augmenterNbRequete(Long idUser) throws StripeException {
		Optional<User> user = userRepository.findById(idUser);

		Stripe.apiKey = env.getProperty("stripe.apikey");
		if (user.get().getAbonnement() != null && user.get().getAbonnement() != "") {
			Subscription sub = Subscription.retrieve(user.get().getAbonnement());
			
			if ("plan_F3SX3mQa0vS0Ri".equals(sub.getPlan().getId())) {
				System.out.println("coucou");
				Map<String, Object> subscriptionitemParams = new HashMap<String, Object>();
				subscriptionitemParams.put("subscription", sub.getId());
				SubscriptionItem item = SubscriptionItem.list(subscriptionitemParams).getData().get(0);

				Instant instant = Instant.now();
				long timeStamp = instant.getEpochSecond();

				Map<String, Object> usagerecordParams = new HashMap<String, Object>();
				usagerecordParams.put("quantity", 1);
				usagerecordParams.put("timestamp", timeStamp);
				UsageRecord.createOnSubscriptionItem(item.getId(), usagerecordParams, null);
			}
		}
	}
}
