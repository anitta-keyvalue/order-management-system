import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateProducts1749190066047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO product (name, price, description, image, stock, created_at, updated_at)
            VALUES 
            ('Laptop Pro X1', 1299.99, 'High-performance laptop with 16GB RAM and 512GB SSD', 'laptop-pro-x1.jpg', 50, NOW(), NOW()),
            ('Wireless Headphones', 199.99, 'Noise-cancelling wireless headphones with 30-hour battery life', 'wireless-headphones.jpg', 100, NOW(), NOW()),
            ('Smart Watch Series 5', 299.99, 'Advanced smartwatch with health monitoring features', 'smart-watch.jpg', 75, NOW(), NOW()),
            ('4K Ultra HD Monitor', 499.99, '32-inch 4K monitor with HDR support', '4k-monitor.jpg', 30, NOW(), NOW()),
            ('Mechanical Keyboard', 149.99, 'RGB mechanical keyboard with customizable keys', 'mechanical-keyboard.jpg', 60, NOW(), NOW()),
            ('Gaming Mouse', 79.99, 'High-precision gaming mouse with programmable buttons', 'gaming-mouse.jpg', 80, NOW(), NOW()),
            ('External SSD 1TB', 129.99, 'Portable SSD with USB 3.1 support', 'external-ssd.jpg', 45, NOW(), NOW()),
            ('Webcam HD Pro', 89.99, '1080p webcam with built-in microphone', 'webcam-hd.jpg', 55, NOW(), NOW()),
            ('Wireless Mouse', 39.99, 'Ergonomic wireless mouse with long battery life', 'wireless-mouse.jpg', 90, NOW(), NOW()),
            ('USB-C Hub', 49.99, '7-in-1 USB-C hub with HDMI and SD card support', 'usb-c-hub.jpg', 70, NOW(), NOW())
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM product 
            WHERE name IN (
                'Laptop Pro X1',
                'Wireless Headphones',
                'Smart Watch Series 5',
                '4K Ultra HD Monitor',
                'Mechanical Keyboard',
                'Gaming Mouse',
                'External SSD 1TB',
                'Webcam HD Pro',
                'Wireless Mouse',
                'USB-C Hub'
            )
        `);
    }

}
