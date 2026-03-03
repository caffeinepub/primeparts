import type { ProductInput } from '../backend';
import { Category } from '../backend';
import { toPaisa } from './format';

export async function seedSampleProducts(
  createProductFn: (input: ProductInput) => Promise<void>
) {
  const sampleProducts: ProductInput[] = [
    {
      name: 'Dell 3542 Keyboard',
      description: 'Original Dell 3542 replacement keyboard. Compatible with Inspiron 3542 and 3541 models. Black color with durable keys.',
      category: Category.keyboard,
      priceInPaisa: toPaisa(1200),
      stockQuantity: BigInt(25),
      imageUrls: [],
    },
    {
      name: 'Dell Laptop Battery',
      description: 'High-capacity replacement battery for Dell laptops. Compatible with multiple models.',
      category: Category.battery,
      priceInPaisa: toPaisa(2500),
      stockQuantity: BigInt(15),
      imageUrls: ['/assets/uploads/1761488567810-WEB_10-1.png'],
    },
    {
      name: '16GB DDR4 RAM',
      description: 'High-performance 16GB DDR4 laptop memory module. 2666MHz speed for faster processing.',
      category: Category.ram,
      priceInPaisa: toPaisa(3500),
      stockQuantity: BigInt(30),
      imageUrls: [],
    },
    {
      name: '256GB NVMe SSD',
      description: 'Fast NVMe SSD for laptop upgrades. Read speed up to 3500MB/s.',
      category: Category.ssd,
      priceInPaisa: toPaisa(2800),
      stockQuantity: BigInt(20),
      imageUrls: [],
    },
    {
      name: '15.6" FHD Display',
      description: 'Full HD 1920x1080 IPS laptop screen replacement. Wide viewing angles and vibrant colors.',
      category: Category.screen,
      priceInPaisa: toPaisa(4500),
      stockQuantity: BigInt(10),
      imageUrls: [],
    },
    {
      name: 'Laptop Cooling Pad',
      description: 'USB-powered cooling pad with dual fans. Reduces laptop temperature by up to 15°C.',
      category: Category.accessory,
      priceInPaisa: toPaisa(899),
      stockQuantity: BigInt(40),
      imageUrls: [],
    },
  ];

  for (const product of sampleProducts) {
    await createProductFn(product);
  }
}
