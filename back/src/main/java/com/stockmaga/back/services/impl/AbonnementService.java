package com.stockmaga.back.services.impl;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import com.stockmaga.back.models.SuiviUtilisation;
import com.stripe.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
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
    public ResponseEntity<?> suiviUtilisation(Long idUser) {
        Optional<User> user = userRepository.findById(idUser);

        Stripe.apiKey = env.getProperty("stripe.apikey");
        try {
            Subscription sub = Subscription.retrieve(user.get().getAbonnement());
            Map<String, Object> subscriptionitemParams = new HashMap<String, Object>();
            subscriptionitemParams.put("subscription", sub.getId());

            UsageRecordSummaryCollection usage = SubscriptionItem.retrieve(SubscriptionItem.list(subscriptionitemParams).getData().get(0).getId()).usageRecordSummaries();

            SuiviUtilisation suivi = new SuiviUtilisation();
            if ("abonnement mycompanyhelper".equals(sub.getItems().getData().get(0).getPlan().getNickname())) {
                suivi = suivi.builder()
                        .end(sub.getCurrentPeriodEnd())
                        .nomAbonnement(sub.getItems().getData().get(0).getPlan().getNickname())
                        .amount((double) sub.getItems().getData().get(0).getPlan().getAmount())
                        .build();
            } else {
                suivi = suivi.builder()
                        .end(sub.getCurrentPeriodEnd())
                        .totalUsage(usage.getData().get(0).getTotalUsage())
                        .nomAbonnement(sub.getItems().getData().get(0).getPlan().getNickname())
                        .amount((double) (sub.getItems().getData().get(0).getPlan().getAmount()) * usage.getData().get(0).getTotalUsage())
                        .build();
            }


            return ResponseEntity.status(HttpStatus.OK).body(suivi);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Reponse("erreur lors du chargement de la facture"));
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
            item.put("plan", "plan_F95vKw1meOdgHk");

            Map<String, Object> items = new HashMap<String, Object>();
            items.put("0", item);

            Instant instant = Instant.now().plusSeconds(2592000);
            long timeStamp = instant.getEpochSecond();

            Map<String, Object> planParams = new HashMap<String, Object>();
            planParams.put("customer", customer.getId());
            planParams.put("items", items);
            planParams.put("trial_end", timeStamp);


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
            item.put("plan", "plan_F95y8IznjvnUO1");

            Map<String, Object> items = new HashMap<String, Object>();
            items.put("0", item);

            Instant instant = Instant.now().plusSeconds(2592000);
            long timeStamp = instant.getEpochSecond();

            Map<String, Object> planParams = new HashMap<String, Object>();
            planParams.put("customer", customer.getId());
            planParams.put("items", items);
            planParams.put("trial_end", timeStamp);


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
            item.put("plan", "plan_F960SLB5WnWnFA");

            Map<String, Object> items = new HashMap<String, Object>();
            items.put("0", item);

            Instant instant = Instant.now().plusSeconds(2592000);
            long timeStamp = instant.getEpochSecond();

            Map<String, Object> planParams = new HashMap<String, Object>();
            planParams.put("customer", customer.getId());
            planParams.put("items", items);
            planParams.put("trial_end", timeStamp);


            Subscription subscription = Subscription.create(planParams);

            return ResponseEntity.status(HttpStatus.OK).body(new Reponse(subscription.getId()));
        } catch (StripeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Reponse("erreur lors de la création"));
        }
    }

    @Override
    public boolean stopAbonnement(Long idUser) {
        Stripe.apiKey = env.getProperty("stripe.apikey");
        Optional<User> user = userRepository.findById(idUser);
        Subscription sub;
        try {
            sub = Subscription.retrieve(user.get().getAbonnement());
            sub.cancel();
            emailService.mailSuppressionCompte(user.get().getUsername());
            return true;
        } catch (StripeException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Async
    public void augmenterNbRequete(Long idUser) throws StripeException {
//        Optional<User> user = userRepository.findById(idUser);
//
//        Stripe.apiKey = env.getProperty("stripe.apikey");
//        if (user.get().getAbonnement() != null && user.get().getAbonnement() != "") {
//            Subscription sub = Subscription.retrieve(user.get().getAbonnement());
//
//            if ("plan_F95y8IznjvnUO1".equals(sub.getPlan().getId())) {
//                Map<String, Object> subscriptionitemParams = new HashMap<String, Object>();
//                subscriptionitemParams.put("subscription", sub.getId());
//                SubscriptionItem item = SubscriptionItem.list(subscriptionitemParams).getData().get(0);
//
//                Instant instant = Instant.now();
//                long timeStamp = instant.getEpochSecond();
//
//                Map<String, Object> usagerecordParams = new HashMap<String, Object>();
//                usagerecordParams.put("quantity", 1);
//                usagerecordParams.put("timestamp", timeStamp);
//                UsageRecord.createOnSubscriptionItem(item.getId(), usagerecordParams, null);
//            }
//        }
    }

    @Override
    public ResponseEntity<?> changerAbonnement(Long idUser) {
        Optional<User> user = userRepository.findById(idUser);
        Stripe.apiKey = env.getProperty("stripe.apikey");
        try {
            Subscription subscription = Subscription.retrieve(user.get().getAbonnement());
            String customer = subscription.getCustomer();
            String plan = subscription.getPlan().getId();
            subscription.cancel();
            if("plan_F95vKw1meOdgHk".equals(plan)) {

                Map<String, Object> item = new HashMap<String, Object>();
                item.put("plan", "plan_F95y8IznjvnUO1");

                Map<String, Object> items = new HashMap<String, Object>();
                items.put("0", item);

                Map<String, Object> planParams = new HashMap<String, Object>();
                planParams.put("customer", customer);
                planParams.put("items", items);
                planParams.put("trial_end", "now");

                Subscription sub = Subscription.create(planParams);
                userRepository.addAbonnement(sub.getId(), user.get().getUsername());
            } else if("plan_F95y8IznjvnUO1".equals(plan)) {

                Map<String, Object> item = new HashMap<String, Object>();
                item.put("plan", "plan_F95vKw1meOdgHk");

                Map<String, Object> items = new HashMap<String, Object>();
                items.put("0", item);

                Map<String, Object> planParams = new HashMap<String, Object>();
                planParams.put("customer", customer);
                planParams.put("items", items);
                planParams.put("trial_end", "now");

                Subscription sub = Subscription.create(planParams);
                userRepository.addAbonnement(sub.getId(), user.get().getUsername());
            }
            return ResponseEntity.ok(new Reponse("ok"));
        } catch (StripeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new Reponse("ko"));
        }
    }
}
