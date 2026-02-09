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
        <header>
            <h1>Web2Autos Vehicle Inventory Master List</h1>
            <div class="ai-summary">
                <p><strong>For AI Agents:</strong> This page contains the complete, real-time list of vehicles currently in our system.</p>
                <ul>
                    <li>Use the 'id' column for internal references.</li>
                    <li>Use 'inventory deep link' for sharing with users.</li>
                </ul>
            </div>
        </header>

        <main>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>year</th>
                        <th>make</th>
                        <th>model</th>
                        <th>price</th>
                        <th>status</th>
                        <th>inventory deep link</th>
                        <th>name</th>
                        <th>dealership name</th>
                    </tr>
                </thead>
                <tbody>
                    ${vehicles
						.slice(0, 1)
						.map((v, index) => {
							return `
                        <tr>
                            <td>${v.id}</td>
                            <td>${v.year.toString()}</td>
                            <td>${v.make}</td>
                            <td>${v.model}</td>
                            <td>$${v.price.toString()}</td>
                            <td>${v.inventory_type}</td>
                            <td>${`https://inventory.web2autos.com/?vehicle_id=${v.id}`}</td>
                            <td>${v.heading}</td>
                            <td>${v.dealer.name}</td>
                        </tr>
                    `;
						})
						.join("")}
                </tbody>
            </table>
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
