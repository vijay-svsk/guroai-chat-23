
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TableOfSpecification } from "@/types/quiz-types";

interface TOSProps {
  tos: TableOfSpecification | null;
}

export const TableOfSpecificationDisplay = ({ tos }: TOSProps) => {
  if (!tos) return null;

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          Table of Specification (TOS)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cognitive Domain</TableHead>
              <TableHead className="text-right">Number of Items</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tos.domains.map((domain, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{domain.level}</TableCell>
                <TableCell className="text-right">{domain.numberOfItems}</TableCell>
                <TableCell className="text-right">{domain.percentage}%</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-gray-50 font-semibold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{tos.totalItems}</TableCell>
              <TableCell className="text-right">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
