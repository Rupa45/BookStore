function getImgUrl(name) {
    // If it's already a full URL (http/https), return as-is
    if (!name) return '';
    if (name.startsWith('http://') || name.startsWith('https://')) {
        return name;
    }
    // Otherwise treat as local asset filename
    try {
        return new URL(`../assets/books/${name}`, import.meta.url).href;
    } catch {
        return '';
    }
}

export { getImgUrl }
