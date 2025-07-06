package com.sitecraft.backend.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "store")
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String storeName;

    private String storeType;

    private String logo;

    private String description;

    private String phoneNumber;

    private String emailAddress;

    private String address;

    private String addressLink;

    private String openingHours;

    private LocalDateTime creationDate;

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialMedia> socialMediaAccounts = new ArrayList<>();

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Policy> policies = new ArrayList<>();

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AboutUs> aboutUs = new ArrayList<>();

    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShippingInfo> shippingInfo = new ArrayList<>();

    @Column(name = "subdomain", unique = true)
    private String subdomain;

    private String status;

    @Column(name = "colors", columnDefinition = "jsonb")
    private JsonNode colors;

    @JsonIgnore
    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CustomizedTemplateSection> customizedTemplate = new ArrayList<>();

    public Store(Long id) {
        this.id = id;
    }

    public Store(Long id, String storeName, String storeType, String logo, String subdomain, String description, String phoneNumber, String emailAddress, String address, String addressLink, String openingHours, LocalDateTime creationDate, List<SocialMedia> socialMediaAccounts, List<Policy> policies, List<AboutUs> aboutUs, List<ShippingInfo> shippingInfo, List<CustomizedTemplateSection> customizedTemplate) {
        this.id = id;
        this.storeName = storeName;
        this.storeType = storeType;
        this.logo = logo;
        this.description = description;
        this.phoneNumber = phoneNumber;
        this.emailAddress = emailAddress;
        this.address = address;
        this.addressLink = addressLink;
        this.openingHours = openingHours;
        this.creationDate = creationDate;
        this.socialMediaAccounts = socialMediaAccounts;
        this.policies = policies;
        this.aboutUs = aboutUs;
        this.shippingInfo = shippingInfo;
        this.customizedTemplate = customizedTemplate;
    }

    public Store() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getStoreType() {
        return storeType;
    }

    public void setStoreType(String storeType) {
        this.storeType = storeType;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getSubdomain() {
        return subdomain;
    }

    public void setSubdomain(String subdomain) {
        this.subdomain = subdomain;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAddressLink() {
        return addressLink;
    }

    public void setAddressLink(String addressLink) {
        this.addressLink = addressLink;
    }

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public List<SocialMedia> getSocialMediaAccounts() {
        return socialMediaAccounts;
    }

    public void setSocialMediaAccounts(List<SocialMedia> socialMediaAccounts) {
        this.socialMediaAccounts = socialMediaAccounts;
    }

    public List<Policy> getPolicies() {
        return policies;
    }

    public void setPolicies(List<Policy> policies) {
        this.policies = policies;
    }

    public List<AboutUs> getAboutUs() {
        return aboutUs;
    }

    public void setAboutUs(List<AboutUs> aboutUs) {
        this.aboutUs = aboutUs;
    }

    public List<ShippingInfo> getShippingInfo() {
        return shippingInfo;
    }

    public void setShippingInfo(List<ShippingInfo> shippingInfo) {
        this.shippingInfo = shippingInfo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getColors() {
        try {
            if (colors != null) {
                return new ObjectMapper().writeValueAsString(colors);
            }
        } catch (Exception e) {
            // Return default colors if serialization fails
        }
        return "{\"primary\":\"#000000\",\"secondary\":\"#ffffff\",\"accent\":\"#ff6b6b\"}";
    }

    public void setColors(String colors) {
        try {
            this.colors = new ObjectMapper().readValue(colors, JsonNode.class);
        } catch (Exception e) {
            // Set default colors if JSON parsing fails
            this.colors = new ObjectMapper().createObjectNode();
        }
    }

    public void setColors(JsonNode colors) {
        this.colors = colors;
    }

    public String getPrimaryColor() {
        try {
            if (colors != null) {
                return colors.get("primary").asText();
            }
        } catch (Exception e) {
            // Return default if parsing fails
        }
        return "#000000";
    }

    public String getSecondaryColor() {
        try {
            if (colors != null) {
                return colors.get("secondary").asText();
            }
        } catch (Exception e) {
            // Return default if parsing fails
        }
        return "#ffffff";
    }

    public String getAccentColor() {
        try {
            if (colors != null) {
                return colors.get("accent").asText();
            }
        } catch (Exception e) {
            // Return default if parsing fails
        }
        return "#ff6b6b";
    }

    public void setColorsFromIndividual(String primary, String secondary, String accent) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ObjectNode colorNode = mapper.createObjectNode();
            colorNode.put("primary", primary);
            colorNode.put("secondary", secondary);
            colorNode.put("accent", accent);
            this.colors = colorNode;
        } catch (Exception e) {
            // Set default colors if JSON creation fails
            try {
                ObjectMapper mapper = new ObjectMapper();
                ObjectNode defaultNode = mapper.createObjectNode();
                defaultNode.put("primary", "#000000");
                defaultNode.put("secondary", "#ffffff");
                defaultNode.put("accent", "#ff6b6b");
                this.colors = defaultNode;
            } catch (Exception ex) {
                this.colors = null;
            }
        }
    }

    public List<CustomizedTemplateSection> getCustomizedTemplate() {
        return customizedTemplate;
    }

    public void setCustomizedTemplate(List<CustomizedTemplateSection> customizedTemplate) {
        this.customizedTemplate = customizedTemplate;
    }

}