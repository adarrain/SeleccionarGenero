import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GET as getGendersApi } from './api/genders/route';

type Gender = {
  codigo: string;
  descripcion: string;
};

async function getGenders(): Promise<Gender[]> {
  try {
    const response = await getGendersApi();
    const json = await response.json();
    if (json.error || !json.data) {
        console.error('API returned an error:', json.message);
        return [];
    }
    return json.data;
  } catch (error) {
    console.error("Error fetching genders:", error);
    return [];
  }
}

export default async function Home() {
  const genders = await getGenders();

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Seleccionar Género</CardTitle>
          <CardDescription className="pt-2">Por favor, elige una opción de la lista.</CardDescription>
        </CardHeader>
        <form action="genero.php" method="POST">
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="genero" className="font-medium">Género</Label>
                <Select name="genero" required>
                  <SelectTrigger id="genero" aria-label="Seleccionar Género" className="w-full">
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent>
                    {genders.length > 0 ? (
                      genders.map((gender) => (
                        <SelectItem key={gender.codigo} value={gender.codigo}>
                          {gender.descripcion}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No se pudieron cargar los géneros</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            <Button type="submit" className="w-full sm:w-auto">Enviar</Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
