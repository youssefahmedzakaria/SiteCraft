// Store Colors API functions

export interface StoreColors {
    primary: string;
    secondary: string;
    accent: string;
}

export const saveStoreColors = async (colors: StoreColors): Promise<any> => {
    try {
        console.log('📞 Saving store colors:', colors);
        const response = await fetch('http://localhost:8080/api/store/colors', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(colors),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Store colors saved successfully:', data);
        
        if (data.success) {
            return data;
        } else {
            throw new Error(data.message || 'Failed to save store colors');
        }
    } catch (error) {
        console.error('💥 Error saving store colors:', error);
        throw error;
    }
};

export const updateStoreColors = async (colors: StoreColors): Promise<any> => {
    try {
        console.log('📞 Updating store colors:', colors);
        const response = await fetch('http://localhost:8080/api/store/colors', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(colors),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Store colors updated successfully:', data);
        
        if (data.success) {
            return data;
        } else {
            throw new Error(data.message || 'Failed to update store colors');
        }
    } catch (error) {
        console.error('💥 Error updating store colors:', error);
        throw error;
    }
};

export const getStoreColors = async (): Promise<StoreColors> => {
    try {
        console.log('📞 Fetching store colors...');
        const response = await fetch('http://localhost:8080/api/store/colors', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Store colors fetched successfully:', data);
        
        if (data.success) {
            // Parse the colors JSON string
            const colorsJson = typeof data.colors === 'string' ? JSON.parse(data.colors) : data.colors;
            return {
                primary: colorsJson.primary || '#000000',
                secondary: colorsJson.secondary || '#ffffff',
                accent: colorsJson.accent || '#ff6b6b'
            };
        } else {
            throw new Error(data.message || 'Failed to fetch store colors');
        }
    } catch (error) {
        console.error('💥 Error fetching store colors:', error);
        // Return default colors on error
        return {
            primary: '#000000',
            secondary: '#ffffff',
            accent: '#ff6b6b'
        };
    }
};
