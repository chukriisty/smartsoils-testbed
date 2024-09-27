import os
import vtk

# Define the directory containing the .vtk files and the output directory for .vtp files
input_directory = "public/data/ert/vtk_files"
output_directory = "./vtp_files"

# Ensure the output directory exists
os.makedirs(output_directory, exist_ok=True)

# Loop through all files in the input directory
for filename in os.listdir(input_directory):
    if filename.endswith(".vtk"):
        # Construct the full file path
        input_file_path = os.path.join(input_directory, filename)
        
        # Read the .vtk file using vtkUnstructuredGridReader
        reader = vtk.vtkUnstructuredGridReader()
        reader.SetFileName(input_file_path)
        reader.Update()
        
        # Get the output as UnstructuredGrid
        unstructured_grid = reader.GetOutput()

        # Convert UnstructuredGrid to PolyData
        geometry_filter = vtk.vtkGeometryFilter()
        geometry_filter.SetInputData(unstructured_grid)
        geometry_filter.Update()

        poly_data = geometry_filter.GetOutput()

        # Prepare the output file path
        output_file_path = os.path.join(output_directory, filename.replace(".vtk", ".vtp"))

        # Write the .vtp file using vtkXMLPolyDataWriter
        writer = vtk.vtkXMLPolyDataWriter()
        writer.SetFileName(output_file_path)
        writer.SetInputData(poly_data)
        writer.Write()

        print(f"Converted {filename} to {output_file_path}")

print("All files have been converted.")
