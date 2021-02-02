import apiKey from '../config';

test('check getting APIKEY, environment variable', () => {
    expect(apiKey()).toBe("TEST-API-KEY");
})