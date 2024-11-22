export function isUserInputCorrect(longitude, latitude) {
    return (
        Number(latitude) >= -90 && 
        Number(latitude) <= 90 &&
        Number(longitude) >= -180 &&
        Number(longitude) <= 180
    );
}
