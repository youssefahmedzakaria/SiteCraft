import type { Product, ProductAttribute, ProductVariant } from "@/lib/products";

export interface SelectedVariant {
    attributeName: string;
    attributeValue: string;
}

/**
 * Generate SKU based on selected variants following the backend format:
 * storeId|productId|attributename-attributevalue|...
 * Attribute names are sorted alphabetically
 */
export function generateSku(
    storeId: number,
    productId: number,
    selectedVariants: SelectedVariant[]
): string {
    // Create attribute pairs in the format "attributename-attributevalue"
    const attributePairs = selectedVariants.map(variant =>
        `${variant.attributeName.toLowerCase()}-${variant.attributeValue.toLowerCase()}`
    );

    // Sort attribute pairs alphabetically (as done in backend)
    attributePairs.sort();

    // Build the SKU
    let sku = `${storeId}|${productId}`;

    if (attributePairs.length > 0) {
        sku += `|${attributePairs.join('|')}`;
    }

    return sku;
}

/**
 * Extract selected variants from the selectedVariants state
 * This maps the frontend variant selection format to our internal format
 */
export function extractSelectedVariants(
    product: Product,
    selectedVariants: Record<string, string>
): SelectedVariant[] {
    const variants: SelectedVariant[] = [];

    if (!product.attributes) {
        return variants;
    }

    // Iterate through product attributes
    product.attributes.forEach(attr => {
        const groupId = `attr-${attr.id}`;
        const selectedOptionId = selectedVariants[groupId];

        if (selectedOptionId) {
            // Extract the attribute value ID from the option ID
            // Format: option-{attrId}-{valueId}
            const parts = selectedOptionId.split('-');
            if (parts.length === 3) {
                const valueId = parseInt(parts[2]);

                // Find the corresponding attribute value
                const attributeValue = attr.attributeValues?.find(av => av.id === valueId);

                if (attributeValue) {
                    variants.push({
                        attributeName: attr.attributeName,
                        attributeValue: attributeValue.attributeValue
                    });
                }
            }
        }
    });

    return variants;
}

/**
 * Find the matching product variant based on generated SKU
 */
export function findMatchingVariant(product: Product, sku: string): ProductVariant | null {
    if (!product.variants || product.variants.length === 0) {
        return null;
    }

    return product.variants.find(variant => variant.sku === sku) || null;
}

/**
 * Validate if the selected variants combination exists for the product
 */
export async function getSession() {
    console.log('🔐 Getting session from backend...');
    const res = await fetch('http://localhost:8080/ecommerce/auth/getSession', {
        credentials: 'include',
    });
    console.log('📡 getSession response status:', res.status);
    console.log('📡 getSession response ok:', res.ok);

    if (!res.ok) {
        console.log('❌ getSession failed');
        return null;
    }

    const sessionData = await res.json();
    console.log('✅ getSession successful, data:', sessionData);
    return sessionData;
}

export async function validateVariantCombination(
    product: Product,
    selectedVariants: Record<string, string>
): Promise<{ isValid: boolean; matchingVariant: ProductVariant | null; error?: string; }> {
    if (!product.attributes || product.attributes.length === 0) {
        return { isValid: true, matchingVariant: null };
    }

    // Check if all required attributes are selected
    const requiredAttributes = product.attributes.filter(attr =>
        attr.attributeValues && attr.attributeValues.length > 0
    );

    const selectedCount = Object.keys(selectedVariants).length;
    const requiredCount = requiredAttributes.length;

    if (selectedCount < requiredCount) {
        return {
            isValid: false,
            matchingVariant: null,
            error: `Please select all required options (${selectedCount}/${requiredCount})`
        };
    }

    const session = await getSession()
    // Generate SKU and find matching variant
    const extractedVariants = extractSelectedVariants(product, selectedVariants);
    const sku = generateSku(session?.storeId || 1, product.id, extractedVariants);
    const matchingVariant = findMatchingVariant(product, sku);

    console.log(`Generated SKU: ${sku}, Matching Variant:`, matchingVariant);

    if (!matchingVariant) {
        return {
            isValid: false,
            matchingVariant: null,
            error: "This combination is not available"
        };
    }

    return { isValid: true, matchingVariant };
} 