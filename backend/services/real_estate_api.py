import os
import httpx
from typing import Optional, Dict, Any, List

SANDBOX_BASE_URL = os.getenv('SANDBOX_BASE_URL', '').rstrip('/')

class RealEstateAPI:
    # Wrapper around the provided API sandbox.
    # If SANDBOX_BASE_URL is not configured, methods fall back to mocked data.
    def __init__(self, base_url: Optional[str] = None, timeout: float = 15.0):
        self.base_url = (base_url or SANDBOX_BASE_URL).rstrip('/') if (base_url or SANDBOX_BASE_URL) else ''
        self.timeout = timeout

    async def _get(self, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
        if not self.base_url:
            return None
        url = f"{self.base_url}/{path.lstrip('/')}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            r = await client.get(url, params=params or {})
            r.raise_for_status()
            return r.json()

    async def list_properties(self, suburb: Optional[str] = None, state: Optional[str] = None) -> List[Dict[str, Any]]:
        data = await self._get('properties', params={'suburb': suburb, 'state': state}) if self.base_url else None
        if data is None:
            data = [
                {
                    'id': 'prop_001',
                    'address': '12 Smith St, Richmond VIC 3121',
                    'bedrooms': 3,
                    'bathrooms': 2,
                    'car_spaces': 1,
                    'listed_price': 1250000,
                    'weekly_rent_estimate': 850,
                    'suburb': 'Richmond',
                    'state': 'VIC',
                    'days_on_market': 21
                },
                {
                    'id': 'prop_002',
                    'address': '8 George St, Parramatta NSW 2150',
                    'bedrooms': 2,
                    'bathrooms': 2,
                    'car_spaces': 1,
                    'listed_price': 780000,
                    'weekly_rent_estimate': 650,
                    'suburb': 'Parramatta',
                    'state': 'NSW',
                    'days_on_market': 55
                },
                {
                    'id': 'prop_003',
                    'address': '5 Jones Ave, Carindale QLD 4152',
                    'bedrooms': 4,
                    'bathrooms': 2,
                    'car_spaces': 2,
                    'listed_price': 985000,
                    'weekly_rent_estimate': 780,
                    'suburb': 'Carindale',
                    'state': 'QLD',
                    'days_on_market': 33
                },
            ]
        return data