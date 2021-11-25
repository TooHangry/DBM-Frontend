// Precondition: The name of the item to transform
// Postcondition: Converts the item name to have capital letters at the start of each word
export const pascalCase = (str: string) => {
    return str.split(' ').map(word => {
        if (word.length > 0) {
            word[0].toUpperCase() + word.substr(1).toLowerCase()
        }
        return word;
    }).join(' ');
}