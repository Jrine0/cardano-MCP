"use client";

export default function BuilderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Builder {params.id}</h1>
      <p>Project details here.</p>
    </div>
  );
}
