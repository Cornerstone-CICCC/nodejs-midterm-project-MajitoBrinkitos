import fs from 'fs';
import path from 'path';

// Utility to read data from a file
const readFromFile = (filePath: string): any[] => {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file at ${filePath}:`, error);
        return [];
    }
};

// Utility to write data to a file
const writeToFile = (filePath: string, data: any[]): void => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing to file at ${filePath}:`, error);
    }
};

// Paths for JSON files
const usersFilePath = path.join(__dirname, '../../data/users.json');
const artworksFilePath = path.join(__dirname, '../../data/artworks.json');

// User-specific helpers
export const readUsers = (): any[] => {
    return readFromFile(usersFilePath);
};

export const writeUsers = (users: any[]): void => {
    writeToFile(usersFilePath, users);
};

// Artwork-specific helpers
export const readArtworks = (): any[] => {
    return readFromFile(artworksFilePath);
};

export const writeArtworks = (artworks: any[]): void => {
    writeToFile(artworksFilePath, artworks);
};
