function getNearestItems(items, latitude, longitude, n) {
    // Calculate the distance between two points using the Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }

    // Calculate the distance between each item and the given coordinates
    const distances = items.map((item) => {
        const { lat, lng } = item;
        const distance = calculateDistance(latitude, longitude, lat, lng);
        return { item, distance };
    });

    // Sort the items by distance in ascending order
    distances.sort((a, b) => a.distance - b.distance);

    // Return the nearest n items
    return distances.slice(0, n).map((item) => item.item);
}
