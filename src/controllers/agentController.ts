import { Request, Response } from "express";
import { getVehicles } from "../db";

export const agentHandler = async (req: Request, res: Response) => {
	try {
		const vehicles = await getVehicles();

		const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Web2Autos Inventory Data View</title>
                <meta name="robots" content="noindex, nofollow">
                <style>
                    body { font-family: sans-serif; padding: 2rem; max-width: 1200px; margin: 0 auto; }
                    h1 { color: #333; }
                    .ai-summary { background: #f0f9ff; padding: 1.5rem; border-left: 5px solid #0284c7; margin-bottom: 2rem; }
                    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
                    th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
                    th { background-color: #f8fafc; font-weight: 600; }
                    tr:hover { background-color: #f1f5f9; }
                    .status-available { color: green; font-weight: bold; }
                </style>
            </head>
            <body>
                <main>
                    <ul>
                        ${vehicles
							.map((v, index) => {
								return `
                                <li>
                                    <p>#${index}. Information about car ${v.heading} is as below:</p>
                                    <p>- Car id: ${v.id}</p>
                                    <p>- Car year: ${v.year.toString()}</p>
                                    <p>- Car make: ${v.make}</p>
                                    <p>- Car model: ${v.model}</p>
                                    <p>- Car price in usd: ${v.price.toString()}</p>
                                    <p>- Car condition: ${v.inventory_type}</p>
                                    <p>- Car details link to visit: ${`https://inventory.web2autos.com/?vehicle_id=${v.id}`}</p>
                                    <p>- Car name: ${v.heading}</p>
                                    <p>- Car dealership name: ${v.dealer.name}</p>
                                </li>
                            `;
							})
							.join("")}
                    </ul>
                </main>
                
                <footer>
                    <p>Generated at: ${new Date().toISOString()}</p>
                </footer>
            </body>
            </html>
            `;

		// 3. Send as HTML
		res.setHeader("Content-Type", "text/html");
		res.send(htmlContent);
	} catch (error) {
		console.error("Vehicle fetch error:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
