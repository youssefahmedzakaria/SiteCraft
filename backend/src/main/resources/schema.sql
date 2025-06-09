-- Base Tables (No dependencies)
CREATE TABLE Store (
                       "id" SERIAL PRIMARY KEY,
                       "store_name" VARCHAR,
                       "store_type" VARCHAR,
                       "logo" VARCHAR,
                       "web_address" VARCHAR,
                       "description" VARCHAR,
                       "phone_number" VARCHAR,
                       "email_address" VARCHAR,
                       "location" VARCHAR,
                       "creation_date" TIMESTAMP
);

CREATE TABLE WishList (
                          "id" SERIAL PRIMARY KEY,
                          "number_of_products" INT
);

CREATE TABLE ShoppingCart (
                              "id" SERIAL PRIMARY KEY,
                              "total_price" DECIMAL
);

CREATE TABLE PaymentLog (
                            "transaction_id" SERIAL PRIMARY KEY,
                            "amount" DECIMAL,
                            "timestamp" TIMESTAMP,
                            "status" VARCHAR,
                            "method" VARCHAR
);

-- Customer-related Tables
CREATE TABLE Customer (
                          "id" SERIAL PRIMARY KEY,
                          "name" VARCHAR,
                          "email" VARCHAR,
                          "password" VARCHAR,
                          "gender" VARCHAR,
                          "phone" VARCHAR,
                          "status" VARCHAR,
                          "wishlist_id" INT REFERENCES WishList ("id"),
                          "cart_id" INT REFERENCES ShoppingCart ("id")
);

CREATE TABLE Address (
                         "id" SERIAL PRIMARY KEY,
                         "title" VARCHAR,
                         "city" VARCHAR,
                         "street_num" VARCHAR,
                         "building_num" VARCHAR,
                         "floor_num" VARCHAR,
                         "apartment_num" VARCHAR,
                         "landmark" VARCHAR,
                         "customer_id" INT REFERENCES Customer ("id")
);

CREATE TABLE Shipping (
                          "id" SERIAL PRIMARY KEY,
                          "cost" DECIMAL,
                          "status" VARCHAR,
                          "address_id" INT REFERENCES Address ("id"),
                          "shipping_date" TIMESTAMP
);

CREATE TABLE Orders (
                       "id" SERIAL PRIMARY KEY,
                       "price" DECIMAL,
                       "status" VARCHAR,
                       "issue_date" TIMESTAMP,
                       "customer_id" INT REFERENCES Customer ("id"),
                       "payment_log_id" INT UNIQUE REFERENCES PaymentLog ("transaction_id"),
                       "shipping_id" INT UNIQUE REFERENCES Shipping ("id")
);

-- Store-related Tables
CREATE TABLE Users (
                       "id" SERIAL PRIMARY KEY,
                       "name" VARCHAR,
                       "email" VARCHAR,
                       "password" VARCHAR,
                       "gender" VARCHAR,
                       "phone" VARCHAR,
                       "role" VARCHAR,
                       "store_id" INT REFERENCES Store ("id")
);

CREATE TABLE AboutUs (
                         "id" SERIAL PRIMARY KEY,
                         "title" VARCHAR,
                         "type" VARCHAR,
                         "status" VARCHAR,
                         "content" VARCHAR,
                         "store_id" INT REFERENCES Store ("id")
);

CREATE TABLE ShippingInfo (
                              "id" SERIAL PRIMARY KEY,
                              "government_name" VARCHAR,
                              "shipping_price" FLOAT,
                              "estimated_delivery_time" VARCHAR,
                              "store_id" INT REFERENCES Store ("id")
);

CREATE TABLE Policies (
                          "id" SERIAL PRIMARY KEY,
                          "title" VARCHAR,
                          "description" TEXT,
                          "status" VARCHAR,
                          "store_id" INT REFERENCES Store ("id")
);

CREATE TABLE SocialMedia (
                             "id" SERIAL PRIMARY KEY,
                             "name" VARCHAR,
                             "link" VARCHAR,
                             "store_id" INT REFERENCES Store ("id")
);

-- Category and Product
CREATE TABLE Category (
                          "id" SERIAL PRIMARY KEY,
                          "name" VARCHAR,
                          "image" VARCHAR,
                          "description" TEXT,
                          "store_id" INT REFERENCES Store ("id")
);

CREATE TABLE Product (
                         "id" SERIAL PRIMARY KEY,
                         "name" VARCHAR,
                         "description" TEXT,
                         "discount_type" VARCHAR,
                         "discount_value" DECIMAL,
                         "min_cap" DECIMAL,
                         "percentage_max" DECIMAL,
                         "max_cap" DECIMAL,
                         "category_id" INT REFERENCES Category ("id"),
                         "store_id" INT REFERENCES Store ("id")
);

CREATE TABLE CategoryProduct (
                                 "id" SERIAL PRIMARY KEY,
                                 "category_id" INT REFERENCES Category ("id"),
                                 "product_id" INT REFERENCES Product ("id")
);

-- Product Attributes and Variants
CREATE TABLE ProductAttribute (
                                  "id" SERIAL PRIMARY KEY,
                                  "attribute_name" VARCHAR,
                                  "product_id" INT REFERENCES Product ("id")
);

CREATE TABLE AttributeValue (
                                "id" SERIAL PRIMARY KEY,
                                "attribute_value" VARCHAR,
                                "product_attribute_id" INT REFERENCES ProductAttribute ("id")
);

CREATE TABLE ProductVariants (
                                 "id" SERIAL PRIMARY KEY,
                                 "sku" VARCHAR,
                                 "stock" INT,
                                 "price" DECIMAL,
                                 "production_cost" DECIMAL,
                                 "product_id" INT REFERENCES Product ("id")
);

CREATE TABLE VariantAttributeValue (
                                       "id" SERIAL PRIMARY KEY,
                                       "variant_id" INT REFERENCES ProductVariants ("id"),
                                       "attribute_value_id" INT REFERENCES AttributeValue ("id")
);

-- Product Images and Reviews
CREATE TABLE ProductImage (
                              "id" SERIAL PRIMARY KEY,
                              "alt" VARCHAR,
                              "image_url" VARCHAR,
                              "product_id" INT REFERENCES Product ("id")
);

CREATE TABLE Review (
                        "id" SERIAL PRIMARY KEY,
                        "comment" TEXT,
                        "rate" INT,
                        "customer_id" INT REFERENCES Customer ("id"),
                        "product_id" INT REFERENCES Product ("id")
);

-- Order and Cart/Wishlist Products
CREATE TABLE OrderProduct (
                              "id" SERIAL PRIMARY KEY,
                              "order_id" INT REFERENCES Orders ("id"),
                              "product_id" INT REFERENCES Product ("id"),
                              "sku" VARCHAR,
                              "quantity" INT,
                              "price" DECIMAL
);

CREATE TABLE WishListProduct (
                                 "id" SERIAL PRIMARY KEY,
                                 "sku" VARCHAR,
                                 "wishlist_id" INT REFERENCES WishList ("id"),
                                 "product_id" INT REFERENCES Product ("id")
);

CREATE TABLE CartProduct (
                             "id" SERIAL PRIMARY KEY,
                             "sku" VARCHAR,
                             "cart_id" INT REFERENCES ShoppingCart ("id"),
                             "product_id" INT REFERENCES Product ("id"),
                             "quantity" INT
);
