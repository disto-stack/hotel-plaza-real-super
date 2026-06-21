"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import GuestCreateModal from "@/components/dashboard/guests/GuestCreateModal";
import GuestsTable from "@/components/dashboard/guests/GuestTable";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { useDebounce } from "@/hooks/useDebounce";
import { useGuests } from "@/hooks/useGuests";

export default function GuestsContent() {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const limit = 10;

	const debouncedSearch = useDebounce(search, 300);

	const { data, isLoading, error } = useGuests({
		page,
		limit,
		search: debouncedSearch,
	});

	useEffect(() => {
		setPage(1);
	}, []);

	const [openCreate, setOpenCreate] = useState(false);

	return (
		<div data-testid="guests-page">
			<header>
				<h1 className="text-3xl font-semibold font-heading">Huéspedes</h1>
				<p className="text-sm text-muted-foreground font-sans pt-2">
					Aquí puedes ver todos los huéspedes registrados en el sistema.
				</p>
			</header>

			<section>
				<div className="flex justify-between py-2 gap-3">
					<SearchBar
						className="w-10/12 xl:w-11/12"
						placeholder="Buscar huésped por nombre, apellido o número de documento"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						data-testid="search-bar-input"
					/>

					<Button
						className="w-2/12 xl:w-1/12"
						variant="default"
						onClick={() => setOpenCreate(true)}
					>
						<Plus className="w-4 h-4" />
						Agregar
					</Button>
				</div>

				{isLoading && (
					<div className="text-sm text-muted-foreground font-sans">
						Cargando...
					</div>
				)}
				{error && (
					<div className="text-sm text-destructive font-sans">
						No se pudieron cargar los huéspedes. Por favor, intente nuevamente.
					</div>
				)}
				{data?.guests && <GuestsTable guests={data.guests} />}

				{data && data.totalCount > 0 && (
					<div className="flex items-center justify-between pt-4 border-t border-border mt-4">
						<span className="text-sm text-muted-foreground font-sans">
							Mostrando {Math.min((page - 1) * limit + 1, data.totalCount)} -{" "}
							{Math.min(page * limit, data.totalCount)} de {data.totalCount}{" "}
							huéspedes
						</span>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => Math.max(p - 1, 1))}
								disabled={page === 1}
								data-testid="prev-page-button"
							>
								Anterior
							</Button>
							<span
								className="text-sm font-medium font-sans px-2"
								data-testid="page-indicator"
							>
								Página {page} de {Math.ceil(data.totalCount / limit) || 1}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setPage((p) => p + 1)}
								disabled={page * limit >= data.totalCount}
								data-testid="next-page-button"
							>
								Siguiente
							</Button>
						</div>
					</div>
				)}
			</section>
			<GuestCreateModal
				open={openCreate}
				onClose={() => setOpenCreate(false)}
			/>
		</div>
	);
}
