-- Base Tables (No dependencies)
CREATE TABLE "store" (
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

CREATE TABLE "wish_list" (
                             "id" SERIAL PRIMARY KEY,
                             "number_of_products" INT
);

CREATE TABLE "shopping_cart" (
                                 "id" SERIAL PRIMARY KEY,
                                 "total_price" DECIMAL
);

CREATE TABLE "payment_log" (
                               "transaction_id" SERIAL PRIMARY KEY,
                               "amount" DECIMAL,
                               "timestamp" TIMESTAMP,
                               "status" VARCHAR,
                               "method" VARCHAR
);

-- Customer-related Tables
CREATE TABLE "customer" (
                            "id" SERIAL PRIMARY KEY,
                            "name" VARCHAR,
                            "email" VARCHAR,
                            "password" VARCHAR,
                            "gender" VARCHAR,
                            "phone" VARCHAR,
                            "status" VARCHAR,
                            "wishlist_id" INT REFERENCES "wish_list" ("id"),
                            "cart_id" INT REFERENCES "shopping_cart" ("id")
);

CREATE TABLE "address" (
                           "id" SERIAL PRIMARY KEY,
                           "title" VARCHAR,
                           "city" VARCHAR,
                           "street_num" VARCHAR,
                           "building_num" VARCHAR,
                           "floor_num" VARCHAR,
                           "apartment_num" VARCHAR,
                           "landmark" VARCHAR,
                           "customer_id" INT REFERENCES "customer" ("id")
);

CREATE TABLE "shipping" (
                            "id" SERIAL PRIMARY KEY,
                            "cost" DECIMAL,
                            "status" VARCHAR,
                            "address_id" INT REFERENCES "address" ("id"),
                            "shipping_date" TIMESTAMP
);

CREATE TABLE "orders" (
                          "id" SERIAL PRIMARY KEY,
                          "price" DECIMAL,
                          "status" VARCHAR,
                          "issue_date" TIMESTAMP,
                          "customer_id" INT REFERENCES "customer" ("id"),
                          "payment_log_id" INT UNIQUE REFERENCES "payment_log" ("transaction_id"),
                          "shipping_id" INT UNIQUE REFERENCES "shipping" ("id")
);

-- Store-related Tables
CREATE TABLE "users" (
                         "id" SERIAL PRIMARY KEY,
                         "name" VARCHAR,
                         "email" VARCHAR,
                         "password" VARCHAR,
                         "gender" VARCHAR,
                         "phone" VARCHAR,
                         "role" VARCHAR,
                         "store_id" INT REFERENCES "store" ("id")
);

CREATE TABLE "about_us" (
                            "id" SERIAL PRIMARY KEY,
                            "title" VARCHAR,
                            "type" VARCHAR,
                            "status" VARCHAR,
                            "content" VARCHAR,
                            "store_id" INT REFERENCES "store" ("id")
);

CREATE TABLE "shipping_info" (
                                 "id" SERIAL PRIMARY KEY,
                                 "government_name" VARCHAR,
                                 "shipping_price" FLOAT,
                                 "estimated_delivery_time" VARCHAR,
                                 "store_id" INT REFERENCES "store" ("id")
);

CREATE TABLE "policies" (
                            "id" SERIAL PRIMARY KEY,
                            "title" VARCHAR,
                            "description" TEXT,
                            "status" VARCHAR,
                            "store_id" INT REFERENCES "store" ("id")
);

CREATE TABLE "social_media" (
                                "id" SERIAL PRIMARY KEY,
                                "name" VARCHAR,
                                "link" VARCHAR,
                                "store_id" INT REFERENCES "store" ("id")
);

-- Category and Product
CREATE TABLE "category" (
                            "id" SERIAL PRIMARY KEY,
                            "name" VARCHAR,
                            "image" VARCHAR,
                            "description" TEXT,
                            "store_id" INT REFERENCES "store" ("id")
);

CREATE TABLE "product" (
                           "id" SERIAL PRIMARY KEY,
                           "name" VARCHAR,
                           "description" TEXT,
                           "discount_type" VARCHAR,
                           "discount_value" DECIMAL,
                           "min_cap" DECIMAL,
                           "percentage_max" DECIMAL,
                           "max_cap" DECIMAL,
                           "category_id" INT REFERENCES "category" ("id"),
                           "store_id" INT REFERENCES "store" ("id")
);

CREATE TABLE "category_product" (
                                    "id" SERIAL PRIMARY KEY,
                                    "category_id" INT REFERENCES "category" ("id"),
                                    "product_id" INT REFERENCES "product" ("id")
);

-- Product Attributes and Variants
CREATE TABLE "product_attribute" (
                                     "id" SERIAL PRIMARY KEY,
                                     "attribute_name" VARCHAR,
                                     "product_id" INT REFERENCES "product" ("id")
);

CREATE TABLE "attribute_value" (
                                   "id" SERIAL PRIMARY KEY,
                                   "attribute_value" VARCHAR,
                                   "product_attribute_id" INT REFERENCES "product_attribute" ("id")
);

CREATE TABLE "product_variants" (
                                    "id" SERIAL PRIMARY KEY,
                                    "sku" VARCHAR,
                                    "stock" INT,
                                    "price" DECIMAL,
                                    "production_cost" DECIMAL,
                                    "product_id" INT REFERENCES "product" ("id")
);

CREATE TABLE "variant_attribute_value" (
                                           "id" SERIAL PRIMARY KEY,
                                           "variant_id" INT REFERENCES "product_variants" ("id"),
                                           "attribute_value_id" INT REFERENCES "attribute_value" ("id")
);

-- Product Images and Reviews
CREATE TABLE "product_image" (
                                 "id" SERIAL PRIMARY KEY,
                                 "alt" VARCHAR,
                                 "image_url" VARCHAR,
                                 "product_id" INT REFERENCES "product" ("id")
);

CREATE TABLE "review" (
                          "id" SERIAL PRIMARY KEY,
                          "comment" TEXT,
                          "rate" INT,
                          "customer_id" INT REFERENCES "customer" ("id"),
                          "product_id" INT REFERENCES "product" ("id")
);

-- Order and Cart/Wishlist Products
CREATE TABLE "order_product" (
                                 "id" SERIAL PRIMARY KEY,
                                 "order_id" INT REFERENCES "orders" ("id"),
                                 "product_id" INT REFERENCES "product" ("id"),
                                 "sku" VARCHAR,
                                 "quantity" INT,
                                 "price" DECIMAL
);

CREATE TABLE "wish_list_product" (
                                     "id" SERIAL PRIMARY KEY,
                                     "sku" VARCHAR,
                                     "wishlist_id" INT REFERENCES "wish_list" ("id"),
                                     "product_id" INT REFERENCES "product" ("id")
);

CREATE TABLE "cart_product" (
                                "id" SERIAL PRIMARY KEY,
                                "sku" VARCHAR,
                                "cart_id" INT REFERENCES "shopping_cart" ("id"),
                                "product_id" INT REFERENCES "product" ("id"),
                                "quantity" INT
);