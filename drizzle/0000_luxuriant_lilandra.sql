CREATE TYPE "public"."stock_movement_reason" AS ENUM('opening_stock', 'restock', 'stock_reduction', 'correction');--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"name" varchar(150) NOT NULL,
	"sku" varchar(64) NOT NULL,
	"category" varchar(100) NOT NULL,
	"unit" varchar(30) DEFAULT 'piece' NOT NULL,
	"purchase_price" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"selling_price" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"current_stock" integer DEFAULT 0 NOT NULL,
	"reorder_level" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity_delta" integer NOT NULL,
	"reason" "stock_movement_reason" NOT NULL,
	"note" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stock_movements_quantity_delta_nonzero" CHECK ("stock_movements"."quantity_delta" <> 0)
);
--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "products_owner_sku_unique" ON "products" USING btree ("owner_id","sku");--> statement-breakpoint
CREATE INDEX "products_owner_id_idx" ON "products" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "stock_movements_owner_created_at_idx" ON "stock_movements" USING btree ("owner_id","created_at");--> statement-breakpoint
CREATE INDEX "stock_movements_product_created_at_idx" ON "stock_movements" USING btree ("product_id","created_at");